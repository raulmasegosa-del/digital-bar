"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/server";

function getSlug(formData: FormData) {
  const slug = (formData.get("slug") as string)?.trim();
  if (!slug) throw new Error("Restaurante no encontrado.");
  return slug;
}

function getImage(formData: FormData) {
  const image = (formData.get("image") as string | null)?.trim();
  return image || null;
}

export async function createCategory(formData: FormData) {
  const slug = getSlug(formData);
  const restaurantId = formData.get("restaurant_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const image = getImage(formData);

  if (!restaurantId) throw new Error("Restaurante no encontrado.");
  if (!name) throw new Error("El nombre es obligatorio.");

  const id = crypto.randomUUID();
  const { error } = await supabaseAdmin
    .from("categories")
    .insert({ id, name, image, restaurant_id: restaurantId });

  if (error) {
    if (/image|column|schema cache/i.test(error.message)) {
      throw new Error(
        "La categoría no puede guardar imágenes todavía porque falta la columna categories.image en Supabase."
      );
    }
    throw error;
  }

  revalidatePath(`/admin/${slug}/categories`);
  revalidatePath(`/admin/${slug}/products`);
  revalidatePath(`/r/${slug}`);
  revalidatePath("/");

  redirect(`/admin/${slug}/categories`);
}

export async function updateCategory(formData: FormData) {
  const slug = getSlug(formData);
  const id = formData.get("id") as string;
  const restaurantId = formData.get("restaurant_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const image = getImage(formData);

  if (!id) throw new Error("Categoría no encontrada.");
  if (!restaurantId) throw new Error("Restaurante no encontrado.");
  if (!name) throw new Error("El nombre es obligatorio.");

  // Actualiza siempre el nombre para que el formulario no falle aunque
  // la columna image aún no esté disponible en una base antigua.
  const { error: nameError } = await supabaseAdmin
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("restaurant_id", restaurantId);

  if (nameError) throw nameError;

  // La imagen se guarda en una operación independiente. Esto evita que
  // un problema de esquema/caché del campo image bloquee el resto del formulario.
  if (image !== null) {
    const { error: imageError } = await supabaseAdmin
      .from("categories")
      .update({ image })
      .eq("id", id)
      .eq("restaurant_id", restaurantId);

    if (imageError) {
      if (/image|column|schema cache/i.test(imageError.message)) {
        throw new Error(
          "La imagen se ha subido, pero falta la columna categories.image en Supabase para poder guardarla."
        );
      }
      throw imageError;
    }
  }

  revalidatePath(`/admin/${slug}/categories`);
  revalidatePath(`/admin/${slug}/categories/${id}`);
  revalidatePath(`/admin/${slug}/products`);
  revalidatePath(`/r/${slug}`);
  revalidatePath("/");

  redirect(`/admin/${slug}/categories`);
}

export async function deleteCategory(
  id: string,
  slug: string,
  restaurantId: string
) {
  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurantId);

  if (error) {
    if (
      error.message.toLowerCase().includes("foreign") ||
      error.message.toLowerCase().includes("constraint")
    ) {
      throw new Error(
        "No puedes eliminar esta categoría porque tiene productos asociados."
      );
    }
    throw error;
  }

  revalidatePath(`/admin/${slug}/categories`);
  revalidatePath(`/admin/${slug}/products`);
  revalidatePath(`/r/${slug}`);
  revalidatePath("/");

  return { success: true };
}

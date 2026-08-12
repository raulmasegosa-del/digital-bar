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

  const payload: Record<string, unknown> = {
    id,
    name,
    restaurant_id: restaurantId,
  };

  // La columna image puede no existir todavía en algunas bases de datos.
  // Intentamos guardarla y, si la API devuelve un error de columna inexistente,
  // creamos la categoría sin imagen para no bloquear la creación.
  const withImage = { ...payload, image };
  let { error } = await supabaseAdmin.from("categories").insert(withImage);

  if (error && /image|column|schema cache/i.test(error.message)) {
    ({ error } = await supabaseAdmin.from("categories").insert(payload));
  }

  if (error) throw error;

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

  let { error } = await supabaseAdmin
    .from("categories")
    .update({ name, image })
    .eq("id", id)
    .eq("restaurant_id", restaurantId);

  if (error && /image|column|schema cache/i.test(error.message)) {
    ({ error } = await supabaseAdmin
      .from("categories")
      .update({ name })
      .eq("id", id)
      .eq("restaurant_id", restaurantId));
  }

  if (error) throw error;

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

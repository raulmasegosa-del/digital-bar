"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getSlug(formData: FormData) {
  const slug = (formData.get("slug") as string)?.trim();
  if (!slug) throw new Error("Restaurante no encontrado.");
  return slug;
}

export async function createCategory(formData: FormData) {
  const slug = getSlug(formData);
  const restaurantId = formData.get("restaurant_id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!restaurantId) throw new Error("Restaurante no encontrado.");
  if (!name) throw new Error("El nombre es obligatorio.");

  const id = crypto.randomUUID();

  const { error } = await supabaseAdmin
    .from("categories")
    .insert({
      id,
      name,
      restaurant_id: restaurantId,
    });

  if (error) throw error;

  revalidatePath(`/admin/${slug}/categories`);
  revalidatePath(`/admin/${slug}/products`);
  revalidatePath("/");

  redirect(`/admin/${slug}/categories`);
}

export async function updateCategory(formData: FormData) {
  const slug = getSlug(formData);
  const id = formData.get("id") as string;
  const restaurantId = formData.get("restaurant_id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!id) throw new Error("Categoría no encontrada.");
  if (!restaurantId) throw new Error("Restaurante no encontrado.");
  if (!name) throw new Error("El nombre es obligatorio.");

  const { error } = await supabaseAdmin
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("restaurant_id", restaurantId);

  if (error) throw error;

  revalidatePath(`/admin/${slug}/categories`);
  revalidatePath(`/admin/${slug}/products`);
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
  revalidatePath("/");

  return { success: true };
}

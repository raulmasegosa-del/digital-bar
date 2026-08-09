"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(
  formData: FormData
) {
  const restaurant_id = formData.get(
    "restaurant_id"
  ) as string;

  const slug = formData.get("slug") as string;

  const name = (
    formData.get("name") as string
  )?.trim();

  if (!name) {
    throw new Error(
      "El nombre es obligatorio."
    );
  }

  const id = crypto.randomUUID();

  const { error } = await supabaseAdmin
    .from("categories")
    .insert({
      id,
      name,
      restaurant_id,
    });

  if (error) throw error;

  revalidatePath(
    `/admin/${slug}/categories`
  );

  redirect(
    `/admin/${slug}/categories`
  );
}

export async function updateCategory(
  formData: FormData
) {
  const id = formData.get("id") as string;

  const slug = formData.get("slug") as string;

  const name = (
    formData.get("name") as string
  )?.trim();

  if (!id) {
    throw new Error(
      "Categoría no encontrada."
    );
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .update({
      name,
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath(
    `/admin/${slug}/categories`
  );

  redirect(
    `/admin/${slug}/categories`
  );
}

export async function deleteCategory(
  id: string,
  slug: string
) {
  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    if (
      error.message
        .toLowerCase()
        .includes("foreign") ||
      error.message
        .toLowerCase()
        .includes("constraint")
    ) {
      throw new Error(
        "No puedes eliminar esta categoría porque tiene productos asociados."
      );
    }

    throw error;
  }

  revalidatePath(
    `/admin/${slug}/categories`
  );

  return {
    success: true,
  };
}
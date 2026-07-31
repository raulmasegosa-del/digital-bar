"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const id = crypto.randomUUID();

  const { error } = await supabase
    .from("categories")
    .insert({
      id,
      name,
    });

  if (error) throw error;

  revalidatePath("/admin/categories");
  revalidatePath("/");

  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!id) throw new Error("Categoría no encontrada.");

  const { error } = await supabase
    .from("categories")
    .update({
      name,
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/categories");
  revalidatePath("/");

  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

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

  revalidatePath("/admin/categories");
  revalidatePath("/");

  return { success: true };
}
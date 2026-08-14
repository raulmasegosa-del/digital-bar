"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  await supabaseAdmin.from("product_option_groups").delete().eq("product_id", id);
  const { error: priceError } = await supabaseAdmin.from("menu_prices").delete().eq("item_id", id);
  if (priceError) throw priceError;
  const { error: itemError } = await supabaseAdmin.from("menu_items").delete().eq("id", id);
  if (itemError) throw itemError;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const image = (formData.get("image") as string) ?? "";
  const restaurant_id = formData.get("restaurant_id") as string;
  const slug = (formData.get("slug") as string)?.trim();
  const category_id = formData.get("category_id") as string;
  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on";
  const price = Number(formData.get("price"));
  const optionGroups = formData.getAll("option_groups") as string[];

  if (!restaurant_id) throw new Error("Restaurante no encontrado.");
  if (!name) throw new Error("El nombre es obligatorio.");
  if (!category_id) throw new Error("La categoría es obligatoria.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("El precio debe ser superior a 0 €.");

  const id = crypto.randomUUID();
  const { error: itemError } = await supabaseAdmin.from("menu_items").insert({
    id, restaurant_id, category_id, name, subtitle, description, image, available, featured, order: 0,
  });
  if (itemError) throw itemError;

  const { error: priceError } = await supabaseAdmin.from("menu_prices").insert({
    item_id: id, label: "Normal", price,
  });
  if (priceError) throw priceError;

  if (optionGroups.length > 0) {
    const rows = optionGroups.map((group_id) => ({ product_id: id, group_id }));
    const { error: optionError } = await supabaseAdmin.from("product_option_groups").insert(rows);
    if (optionError) throw optionError;
  }

  revalidatePath("/");
  if (slug) revalidatePath(`/admin/${slug}/products`);
  redirect(slug ? `/admin/${slug}/products` : "/admin");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Producto no encontrado.");

  const name = (formData.get("name") as string)?.trim();
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const image = (formData.get("image") as string) ?? "";
  const category_id = formData.get("category_id") as string;
  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on";
  const price = Number(formData.get("price"));
  const optionGroups = formData.getAll("option_groups") as string[];

  if (!name) throw new Error("El nombre es obligatorio.");
  if (!category_id) throw new Error("La categoría es obligatoria.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("El precio debe ser superior a 0 €.");

  const { error: itemError } = await supabaseAdmin.from("menu_items").update({
    name, subtitle, description, image, category_id, available, featured,
  }).eq("id", id);
  if (itemError) throw itemError;

  const { error: priceError } = await supabaseAdmin.from("menu_prices").update({ price }).eq("item_id", id);
  if (priceError) throw priceError;

  const { error: deleteOptionsError } = await supabaseAdmin.from("product_option_groups").delete().eq("product_id", id);
  if (deleteOptionsError) throw deleteOptionsError;

  if (optionGroups.length > 0) {
    const rows = optionGroups.map((group_id) => ({ product_id: id, group_id }));
    const { error: optionError } = await supabaseAdmin.from("product_option_groups").insert(rows);
    if (optionError) throw optionError;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createOptionItem(formData: FormData) {
  const group_id = formData.get("group_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const extra_price = Number(formData.get("extra_price"));
  const order = Number(formData.get("order"));
  const available = formData.get("available") === "on";
  if (!group_id) throw new Error("Debe seleccionar un grupo.");
  if (!name) throw new Error("El nombre es obligatorio.");
  const { error } = await supabaseAdmin.from("option_items").insert({ group_id, name, extra_price, order, available });
  if (error) throw error;
  revalidatePath("/admin/options");
  redirect("/admin/options");
}

export async function updateOptionItem(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) throw new Error("Opción no encontrada.");
  const group_id = formData.get("group_id") as string;
  const name = (formData.get("name") as string)?.trim();
  const extra_price = Number(formData.get("extra_price"));
  const order = Number(formData.get("order"));
  const available = formData.get("available") === "on";
  if (!group_id) throw new Error("Debe seleccionar un grupo.");
  if (!name) throw new Error("El nombre es obligatorio.");
  const { error } = await supabaseAdmin.from("option_items").update({ group_id, name, extra_price, order, available }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/options");
  redirect("/admin/options");
}

export async function toggleProductAvailable(id: string, available: boolean) {
  if (!id) throw new Error("Producto no encontrado.");
  const { error } = await supabaseAdmin.from("menu_items").update({ available }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}
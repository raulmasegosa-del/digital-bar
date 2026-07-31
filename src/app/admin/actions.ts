"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  // Eliminar precios
  const { error: priceError } = await supabase
    .from("menu_prices")
    .delete()
    .eq("item_id", id);

  if (priceError) throw priceError;

  // Eliminar producto
  const { error: itemError } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (itemError) throw itemError;

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const image = (formData.get("image") as string) ?? "";

  const category_id = formData.get("category_id") as string;

  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on";

  const price = Number(formData.get("price"));

  if (!name) throw new Error("El nombre es obligatorio.");

  if (!category_id) throw new Error("La categoría es obligatoria.");

  if (isNaN(price) || price < 0)
    throw new Error("El precio no es válido.");

  const id = crypto.randomUUID();

  const { error: itemError } = await supabase
    .from("menu_items")
    .insert({
      id,
      category_id,
      name,
      subtitle,
      description,
      image,
      available,
      featured,
    });

  if (itemError) throw itemError;

  const { error: priceError } = await supabase
    .from("menu_prices")
    .insert({
      item_id: id,
      label: "Normal",
      price,
    });

  if (priceError) throw priceError;

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Producto no encontrado.");
  }

  const name = (formData.get("name") as string)?.trim();
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const image = (formData.get("image") as string) ?? "";

  const category_id = formData.get("category_id") as string;

  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on";

  const price = Number(formData.get("price"));

  if (!name) throw new Error("El nombre es obligatorio.");

  if (!category_id) throw new Error("La categoría es obligatoria.");

  if (isNaN(price) || price < 0)
    throw new Error("El precio no es válido.");

  console.log("===== UPDATE =====");
  console.log({
    id,
    name,
    subtitle,
    description,
    image,
    category_id,
    available,
    featured,
    price,
  });

  const { error: itemError } = await supabase
    .from("menu_items")
    .update({
      name,
      subtitle,
      description,
      image,
      category_id,
      available,
      featured,
    })
    .eq("id", id);

  if (itemError) throw itemError;

  const { error: priceError } = await supabase
    .from("menu_prices")
    .update({
      price,
    })
    .eq("item_id", id);

  if (priceError) throw priceError;

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin");
}
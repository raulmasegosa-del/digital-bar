"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { findProductImage } from "@/lib/images/findProductImage";

export async function findMissingProductImages(slug: string) {
  const restaurant = await getRestaurant(slug);
  if (!restaurant) throw new Error("Restaurante no encontrado.");

  const { data: products, error } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, image, category_id, categories(name)")
    .eq("restaurant_id", restaurant.id)
    .or("image.is.null,image.eq.");

  if (error) throw error;

  let updated = 0;
  let unmatched = 0;

  for (const product of products ?? []) {
    const categoryName = Array.isArray(product.categories)
      ? product.categories[0]?.name
      : product.categories?.name;

    if (!categoryName) {
      unmatched += 1;
      continue;
    }

    const image = await findProductImage({
      categoryName,
      productName: product.name,
    });

    if (!image) {
      unmatched += 1;
      continue;
    }

    const { error: updateError } = await supabaseAdmin
      .from("menu_items")
      .update({ image })
      .eq("id", product.id)
      .eq("restaurant_id", restaurant.id)
      .or("image.is.null,image.eq.");

    if (updateError) throw updateError;
    updated += 1;
  }

  revalidatePath(`/admin/${slug}/products`);
  revalidatePath(`/r/${slug}`);

  return { updated, unmatched };
}

import { supabaseAdmin } from "@/lib/supabase/server";

type CreateRestaurantProductParams = {
  restaurantId: string;
  categoryId: string;
  name: string;
  price: number;
  subtitle?: string;
  description?: string;
  image?: string | null;
  available?: boolean;
  featured?: boolean;
  order?: number;
  preparationTime?: number | null;
  optionGroupIds?: string[];
};

export async function createRestaurantProduct({
  restaurantId,
  categoryId,
  name,
  price,
  subtitle = "",
  description = "",
  image = null,
  available = true,
  featured = false,
  order = 0,
  preparationTime = null,
  optionGroupIds = [],
}: CreateRestaurantProductParams) {
  if (!restaurantId) {
    throw new Error("El restaurante es obligatorio.");
  }

  if (!categoryId) {
    throw new Error("La categoría es obligatoria.");
  }

  if (!name.trim()) {
    throw new Error("El nombre del producto es obligatorio.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("El precio del producto no es válido.");
  }

  // Comprobar que la categoría pertenece al restaurante
  const { data: category, error: categoryError } =
    await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

  if (categoryError) {
    throw categoryError;
  }

  if (!category) {
    throw new Error(
      "La categoría no pertenece al restaurante."
    );
  }

  const productId = crypto.randomUUID();

  // Crear producto
  const { error: productError } =
    await supabaseAdmin
      .from("menu_items")
      .insert({
        id: productId,
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: name.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image,
        available,
        featured,
        order,
        preparation_time: preparationTime,
      });

  if (productError) {
    throw productError;
  }

  // Crear precio
  const { error: priceError } =
    await supabaseAdmin
      .from("menu_prices")
      .insert({
        item_id: productId,
        label: "Normal",
        price,
        order: 0,
      });

  if (priceError) {
    throw priceError;
  }

  // Asociar grupos de opciones
  if (optionGroupIds.length > 0) {
    const rows = optionGroupIds.map(
      (groupId) => ({
        product_id: productId,
        group_id: groupId,
      })
    );

    const { error: optionError } =
      await supabaseAdmin
        .from("product_option_groups")
        .insert(rows);

    if (optionError) {
      throw optionError;
    }
  }

  return {
    id: productId,
    restaurantId,
    categoryId,
    name: name.trim(),
    price,
  };
}
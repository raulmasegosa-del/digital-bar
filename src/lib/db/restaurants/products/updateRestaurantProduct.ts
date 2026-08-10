import { supabaseAdmin } from "@/lib/supabase/server";

type UpdateRestaurantProductParams = {
  restaurantId: string;
  productId: string;
  categoryId?: string;
  name?: string;
  price?: number;
  subtitle?: string;
  description?: string;
  image?: string | null;
  available?: boolean;
  featured?: boolean;
  order?: number;
  preparationTime?: number | null;
  emptyFields?: "keep" | "clear";
};

export async function updateRestaurantProduct({
  restaurantId,
  productId,
  categoryId,
  name,
  price,
  subtitle,
  description,
  image,
  available,
  featured,
  order,
  preparationTime,
  emptyFields = "keep",
}: UpdateRestaurantProductParams) {
  if (!restaurantId) {
    throw new Error("El restaurante es obligatorio.");
  }

  if (!productId) {
    throw new Error("El producto es obligatorio.");
  }

  // Comprobar que el producto pertenece al restaurante
  const { data: existingProduct, error: productError } =
    await supabaseAdmin
      .from("menu_items")
      .select("id, category_id")
      .eq("id", productId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!existingProduct) {
    throw new Error(
      "El producto no pertenece al restaurante."
    );
  }

  // Si se proporciona una categoría,
  // comprobar que pertenece al restaurante.
  if (categoryId) {
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
  }

  if (
    name !== undefined &&
    !name.trim()
  ) {
    throw new Error(
      "El nombre del producto no puede estar vacío."
    );
  }

  if (
    price !== undefined &&
    (!Number.isFinite(price) || price < 0)
  ) {
    throw new Error(
      "El precio del producto no es válido."
    );
  }

  const updateData: Record<
    string,
    unknown
  > = {};

  if (categoryId !== undefined) {
    updateData.category_id = categoryId;
  }

  if (name !== undefined) {
    updateData.name = name.trim();
  }

  if (price !== undefined) {
    // El precio se actualiza aparte en menu_prices.
  }

  if (
    subtitle !== undefined &&
    (emptyFields === "clear" ||
      subtitle !== "")
  ) {
    updateData.subtitle = subtitle.trim();
  }

  if (
    description !== undefined &&
    (emptyFields === "clear" ||
      description !== "")
  ) {
    updateData.description =
      description.trim();
  }

  if (image !== undefined) {
    if (
      emptyFields === "clear" ||
      image !== ""
    ) {
      updateData.image = image;
    }
  }

  if (available !== undefined) {
    updateData.available = available;
  }

  if (featured !== undefined) {
    updateData.featured = featured;
  }

  if (order !== undefined) {
    updateData.order = order;
  }

  if (preparationTime !== undefined) {
    if (
      emptyFields === "clear" ||
      preparationTime !== null
    ) {
      updateData.preparation_time =
        preparationTime;
    }
  }

  // Actualizar producto
  if (Object.keys(updateData).length > 0) {
    const { error } = await supabaseAdmin
      .from("menu_items")
      .update(updateData)
      .eq("id", productId)
      .eq("restaurant_id", restaurantId);

    if (error) {
      throw error;
    }
  }

  // Actualizar precio
  if (price !== undefined) {
    const { data: existingPrice, error: priceFindError } =
      await supabaseAdmin
        .from("menu_prices")
        .select("id")
        .eq("item_id", productId)
        .eq("label", "Normal")
        .maybeSingle();

    if (priceFindError) {
      throw priceFindError;
    }

    if (existingPrice) {
      const { error: priceUpdateError } =
        await supabaseAdmin
          .from("menu_prices")
          .update({
            price,
          })
          .eq("id", existingPrice.id);

      if (priceUpdateError) {
        throw priceUpdateError;
      }
    } else {
      const { error: priceInsertError } =
        await supabaseAdmin
          .from("menu_prices")
          .insert({
            item_id: productId,
            label: "Normal",
            price,
            order: 0,
          });

      if (priceInsertError) {
        throw priceInsertError;
      }
    }
  }

  return {
    id: productId,
    restaurantId,
    categoryId:
      categoryId ??
      existingProduct.category_id,
    name,
    price,
  };
}
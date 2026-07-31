import { supabase } from "@/lib/supabase";

export async function getFullMenu() {
  // Categorías
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .order("order");

  if (categoryError) {
    throw categoryError;
  }

  // Productos
  const { data: items, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .order("order");

  if (itemError) {
    throw itemError;
  }

  // Precios
  const { data: prices, error: priceError } = await supabase
    .from("menu_prices")
    .select("*")
    .order("order");

  if (priceError) {
    throw priceError;
  }

  // Construcción del menú
  const menu = (categories ?? []).map((category) => ({
    ...category,
    items: (items ?? [])
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        ...item,
        prices: (prices ?? []).filter(
          (price) => price.item_id === item.id
        ),
      })),
  }));

  return menu;
}
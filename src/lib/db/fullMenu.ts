import { supabase } from "@/lib/supabase/client";

export async function getFullMenu() {
  // Categorías
  const { data: categories, error: categoryError } =
    await supabase
      .from("categories")
      .select("*")
      .order("order");

  if (categoryError) throw categoryError;

  // Productos
  const { data: items, error: itemError } =
    await supabase
      .from("menu_items")
      .select("*")
      .order("order");

  if (itemError) throw itemError;

  // Precios
  const { data: prices, error: priceError } =
    await supabase
      .from("menu_prices")
      .select("*");

  if (priceError) throw priceError;

  // Relación producto ↔ grupo
  const {
    data: productGroups,
    error: productGroupError,
  } = await supabase
    .from("product_option_groups")
    .select("*");

  if (productGroupError) throw productGroupError;

  // Grupos
  const {
    data: groups,
    error: groupError,
  } = await supabase
    .from("option_groups")
    .select("*")
    .order("order");

  if (groupError) throw groupError;

  // Opciones
  const {
    data: options,
    error: optionError,
  } = await supabase
    .from("option_items")
    .select("*")
    .order("order");

  if (optionError) throw optionError;

  return (categories ?? []).map((category) => ({
    ...category,

    items: (items ?? [])
      .filter(
        (item) => item.category_id === category.id
      )
      .map((item) => {
        const groupIds = (productGroups ?? [])
          .filter(
            (g) => g.product_id === item.id
          )
          .map((g) => g.group_id);
console.log({
  categories: categories?.length,
  items: items?.length,
  prices: prices?.length,
});
        return {
          ...item,

          prices: (prices ?? []).filter(
            (p) => p.item_id === item.id
          ),

          option_groups: (groups ?? [])
            .filter((g) =>
              groupIds.includes(g.id)
            )
            .map((group) => ({
              ...group,

              items: (options ?? []).filter(
                (o) => o.group_id === group.id
              ),
            })),
        };
      }),
  }));
}
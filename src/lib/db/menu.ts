import { supabase } from "@/lib/supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order");

  if (error) {
    throw error;
  }

  return data;
}

export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_prices (
        id,
        label,
        price,
        order
      )
    `)
    .order("order");

  if (error) {
    throw error;
  }

  return data;
}
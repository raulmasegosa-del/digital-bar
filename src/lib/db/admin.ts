import { supabaseAdmin } from "@/lib/supabase/server";

import type {
  AdminCategory,
  AdminProduct,
  AdminOptionItem,
} from "@/types/admin";

export type OptionGroup = {
  id: string;
  name: string;
};

/* ==========================================================
   PRODUCTOS
========================================================== */

export async function getAdminProducts(
  restaurantId?: string
): Promise<AdminProduct[]> {
  let query = supabaseAdmin
    .from("menu_items")
    .select(`
      *,
      categories(name),
      menu_prices(*)
    `)
    .order("order");

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as AdminProduct[];
}

export async function getProduct(
  id: string,
  restaurantId?: string
): Promise<AdminProduct | null> {
  let query = supabaseAdmin
    .from("menu_items")
    .select(`
      *,
      categories(name),
      menu_prices(*)
    `)
    .eq("id", id);

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;

  return data as AdminProduct | null;
}

/* ==========================================================
   CATEGORÍAS
========================================================== */

export async function getCategories(
  restaurantId?: string
): Promise<AdminCategory[]> {
  let query = supabaseAdmin
    .from("categories")
    .select("*")
    .order("order");

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as AdminCategory[];
}

export async function getCategory(
  id: string,
  restaurantId?: string
): Promise<AdminCategory | null> {
  let query = supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id);

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query.single();

  if (error) throw error;

  return data as AdminCategory;
}

/* ==========================================================
   GRUPOS DE OPCIONES
========================================================== */

export async function getOptionGroups(
  restaurantId?: string
): Promise<OptionGroup[]> {
  let query = supabaseAdmin
    .from("option_groups")
    .select("id, name")
    .order("order");

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
}

/* ==========================================================
   OPCIONES
========================================================== */

export async function getOptionItem(id: string) {
  const { data, error } = await supabaseAdmin
    .from("option_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getProductOptionGroups(
  productId: string
): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("product_option_groups")
    .select("group_id")
    .eq("product_id", productId);

  if (error) throw error;

  return (data ?? []).map((row) => row.group_id);
}

export async function getOptionItems(): Promise<AdminOptionItem[]> {
  const { data, error } = await supabaseAdmin
    .from("option_items")
    .select(`
      *,
      option_groups(name)
    `)
    .order("order");

  if (error) throw error;

  return (data ?? []) as AdminOptionItem[];
}
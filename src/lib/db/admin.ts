import { supabaseAdmin } from "@/lib/supabase/server";

import type {
  AdminCategory,
  AdminOptionGroup,
  AdminOptionItem,
  AdminProduct,
} from "@/types/admin";

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

  const { data, error } =
    await query.maybeSingle();

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

  const { data, error } =
    await query.maybeSingle();

  if (error) throw error;

  return data as AdminCategory | null;
}

/* ==========================================================
   GRUPOS DE OPCIONES
========================================================== */

export async function getOptionGroups(
  restaurantId?: string
): Promise<AdminOptionGroup[]> {
  let query = supabaseAdmin
    .from("option_groups")
    .select(`
      *,
      items:option_items(*)
    `)
    .order("order");

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as AdminOptionGroup[];
}

export async function getOptionGroup(
  id: string,
  restaurantId?: string
): Promise<AdminOptionGroup | null> {
  let query = supabaseAdmin
    .from("option_groups")
    .select(`
      *,
      items:option_items(*)
    `)
    .eq("id", id);

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } =
    await query.maybeSingle();

  if (error) throw error;

  return data as AdminOptionGroup | null;
}

/* ==========================================================
   OPCIONES
========================================================== */

export async function getOptionItems(
  restaurantId?: string
): Promise<AdminOptionItem[]> {
  let query = supabaseAdmin
    .from("option_items")
    .select(`
      *,
      option_groups(name)
    `)
    .order("order");

  if (restaurantId) {
    query = query.eq(
      "restaurant_id",
      restaurantId
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as AdminOptionItem[];
}

export async function getOptionItem(
  id: string,
  restaurantId?: string
): Promise<AdminOptionItem | null> {
  let query = supabaseAdmin
    .from("option_items")
    .select(`
      *,
      option_groups(name)
    `)
    .eq("id", id);

  if (restaurantId) {
    query = query.eq(
      "restaurant_id",
      restaurantId
    );
  }

  const { data, error } =
    await query.maybeSingle();

  if (error) throw error;

  return data as AdminOptionItem | null;
}

/* ==========================================================
   PRODUCTO ↔ GRUPOS DE OPCIONES
========================================================== */

export async function getProductOptionGroups(
  productId: string
): Promise<string[]> {
  const { data, error } =
    await supabaseAdmin
      .from("product_option_groups")
      .select("group_id")
      .eq("product_id", productId);

  if (error) throw error;

  return (data ?? []).map(
    (row) => row.group_id
  );
}
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
    .select("*")
    .order("order");

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data: groups, error: groupsError } = await query;

  if (groupsError) throw groupsError;

  const groupRows = groups ?? [];

  if (groupRows.length === 0) {
    return [];
  }

  const groupIds = groupRows.map((group) => group.id);

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("option_items")
    .select("*")
    .in("group_id", groupIds)
    .order("order");

  if (itemsError) throw itemsError;

  const itemsByGroup = new Map<string, AdminOptionItem[]>();

  for (const item of items ?? []) {
    const current = itemsByGroup.get(item.group_id) ?? [];
    current.push(item as AdminOptionItem);
    itemsByGroup.set(item.group_id, current);
  }

  return groupRows.map((group) => ({
    ...group,
    items: itemsByGroup.get(group.id) ?? [],
  })) as AdminOptionGroup[];
}

export async function getOptionGroup(
  id: string,
  restaurantId?: string
): Promise<AdminOptionGroup | null> {
  let query = supabaseAdmin
    .from("option_groups")
    .select("*")
    .eq("id", id);

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } =
    await query.maybeSingle();

  if (error) throw error;

  if (!data) return null;

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("option_items")
    .select("*")
    .eq("group_id", id)
    .order("order");

  if (itemsError) throw itemsError;

  return {
    ...data,
    items: items ?? [],
  } as AdminOptionGroup;
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
    query = query.eq("restaurant_id", restaurantId);
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
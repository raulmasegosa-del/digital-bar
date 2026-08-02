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

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select(`
      *,
      categories(name),
      menu_prices(*)
    `)
    .order("order");

  if (error) throw error;

  return (data ?? []) as AdminProduct[];
}

export async function getCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("order");

  if (error) throw error;

  return (data ?? []) as AdminCategory[];
}

export async function getProduct(
  id: string
): Promise<AdminProduct | null> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select(`
      *,
      categories(name),
      menu_prices(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data as AdminProduct | null;
}

export async function getCategory(
  id: string
): Promise<AdminCategory | null> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as AdminCategory;
}

/* ==========================================================
   OPCIONES
========================================================== */

export async function getOptionGroups(): Promise<OptionGroup[]> {
  const { data, error } = await supabaseAdmin
    .from("option_groups")
    .select("id, name")
    .order("order");

  if (error) throw error;

  return data ?? [];
}

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

  console.log("OPTION ITEMS:", data);

  return (data ?? []) as AdminOptionItem[];
}
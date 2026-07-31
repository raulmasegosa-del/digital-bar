import { supabaseAdmin } from "@/lib/supabase/server";
import type {
  AdminCategory,
  AdminProduct,
} from "@/types/admin";

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
    .single();

  if (error) throw error;

  return data as AdminProduct;
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
import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("order");

  if (error) throw error;

  return data;
}
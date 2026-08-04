import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  return data ?? [];
}
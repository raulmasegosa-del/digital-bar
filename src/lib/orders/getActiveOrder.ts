import { supabase } from "@/lib/supabase/client";

export async function getActiveOrder(
  table: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("table_number", table)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
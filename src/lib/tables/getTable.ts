import { supabaseAdmin } from "@/lib/supabase/server";

export async function getTable(
  number: string
) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        menu_items(name)
      )
    `)
    .eq("table_number", number)
    .neq("status", "cancelled")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}
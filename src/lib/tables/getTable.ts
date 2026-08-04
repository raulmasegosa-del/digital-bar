import { supabaseAdmin } from "@/lib/supabase/server";

import { TableOrder } from "@/types/tables";

export async function getTable(
  number: string
): Promise<TableOrder | null> {
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

  if (error) {
    throw error;
  }

  return data as TableOrder | null;
}
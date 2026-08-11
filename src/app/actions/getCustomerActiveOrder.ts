"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCustomerActiveOrder(restaurantId: string, table: string) {
  const tableNumber = table.trim();
  if (!restaurantId || !tableNumber) return null;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      table_number,
      status,
      total,
      order_items (
        id,
        product_id,
        name,
        quantity,
        price,
        options
      )
    `)
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

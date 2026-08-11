import { supabase } from "@/lib/supabase/client";

import type { Order } from "@/types/orders";

export async function getActiveOrder(
  restaurantId: string,
  table: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
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
    .eq("table_number", table)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
}

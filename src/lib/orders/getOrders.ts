import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/orders";

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      table_number,
      notes,
      total,
      status,
      created_at,
      order_items (
        id,
        product_id,
        name,
        quantity,
        price,
        options
      )
    `)
    .in("status", [
      "pending",
      "preparing",
      "ready",
    ])
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((order) => ({
    ...order,
    table: order.table_number,
  })) as Order[];
}
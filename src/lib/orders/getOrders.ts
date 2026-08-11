import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/orders";

export async function getOrders(restaurantId: string): Promise<Order[]> {
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
    .eq("restaurant_id", restaurantId)
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
    id: order.id,
    table: order.table_number ?? "",
    table_number: order.table_number ?? "",
    status: order.status,
    notes: order.notes ?? "",
    total: order.total ?? 0,
    created_at: order.created_at,
    order_items: (order.order_items ?? []).map((item) => ({
      id: item.id,
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options ?? [],
    })),
  }));
}

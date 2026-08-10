import { supabaseClient } from "@/lib/supabase/client";

import { getActiveOrder } from "./getActiveOrder";
import { addItemsToOrder } from "./addItemsToOrder";

import type { CartItem } from "@/context/CartContext";

type CreateOrderParams = {
  table: string;
  items: CartItem[];
  notes: string;
  total: number;
};

export async function createOrder({
  table,
  items,
  notes,
  total,
}: CreateOrderParams) {
  const activeOrder =
    await getActiveOrder(table);

  if (activeOrder) {
    await addItemsToOrder(
      activeOrder.id,
      items,
      total,
      notes
    );

    return activeOrder;
  }

  const { data: order, error } =
    await supabaseClient
      .from("orders")
      .insert({
        table_number: table,
        notes,
        total,
        status: "pending",
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  const rows = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options,
  }));

  const { error: itemError } =
    await supabaseClient
      .from("order_items")
      .insert(rows);

  if (itemError) {
    throw itemError;
  }

  return order;
}
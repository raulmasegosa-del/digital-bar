import { supabase } from "@/lib/supabase/client";

import type { CartItem } from "@/context/CartContext";

export async function addItemsToOrder(
  orderId: string,
  items: CartItem[],
  total: number,
  notes: string
) {
  const rows = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(rows);

  if (itemsError) {
    throw itemsError;
  }

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select("total, notes")
      .eq("id", orderId)
      .single();

  if (orderError) {
    throw orderError;
  }

  const mergedNotes =
    notes.trim().length > 0
      ? order.notes
        ? `${order.notes}\n${notes}`
        : notes
      : order.notes;

  const { error: updateError } =
    await supabase
      .from("orders")
      .update({
        total:
          Number(order.total) + total,
        notes: mergedNotes,
      })
      .eq("id", orderId);

  if (updateError) {
    throw updateError;
  }
}
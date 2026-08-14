import { supabase } from "@/lib/supabase/client";

import type { CartItem } from "@/context/CartContext";

function calculateIncludedTax(total: number, taxRate: number) {
  if (taxRate <= 0) return 0;
  return Number(((total * taxRate) / (100 + taxRate)).toFixed(2));
}

export async function addItemsToOrder(
  orderId: string,
  items: CartItem[],
  total: number,
  notes: string
) {
  const productIds = Array.from(
    new Set(items.map((item) => item.productId).filter(Boolean))
  );

  const { data: products, error: productsError } = await supabase
    .from("menu_items")
    .select("id, tax_rate")
    .in("id", productIds);

  if (productsError) {
    throw productsError;
  }

  const taxByProductId = new Map(
    (products ?? []).map((product) => [
      product.id,
      Number(product.tax_rate ?? 10),
    ])
  );

  const rows = items.map((item) => {
    const taxRate = taxByProductId.get(item.productId) ?? 10;
    const lineTotal = Number(item.price) * Number(item.quantity);

    return {
      order_id: orderId,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options,
      tax_rate: taxRate,
      tax_amount: calculateIncludedTax(lineTotal, taxRate),
    };
  });

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

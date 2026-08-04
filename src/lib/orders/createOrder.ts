import { supabase } from "@/lib/supabase/client";

export async function createOrder({
  table,
  items,
  notes,
  total,
}: {
  table: string;
  items: any[];
  notes: string;
  total: number;
}) {
  const { data: order, error } = await supabase
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
  console.error("ORDER ERROR:", error);
  throw new Error(error.message);
}

  const rows = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options,
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(rows);

  if (itemError) {
  console.error("ORDER ITEMS ERROR:", itemError);
  throw new Error(itemError.message);
}

  return order;
}
import { supabase } from "@/lib/supabase/client";

export async function getOrder(orderId: string) {
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
    .eq("id", orderId)
    .single();

  if (error) throw error;

  return data;
}

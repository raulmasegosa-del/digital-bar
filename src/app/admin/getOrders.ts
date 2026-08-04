import { supabase } from "@/lib/supabase/client";

export async function getOrders() {

  const { data: orders, error } = await supabase
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
    .order("created_at", {
      ascending: false,
    });


  if (error) {
    throw error;
  }


  return orders ?? [];
}
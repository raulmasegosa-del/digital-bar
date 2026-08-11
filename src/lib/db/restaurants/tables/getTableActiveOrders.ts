import { supabaseAdmin } from "@/lib/supabase/server";

export type TableActiveOrder = {
  id: string;
  table_number: string | null;
  status: string | null;
  notes: string | null;
  total: number | null;
  created_at: string | null;
  order_items: Array<{
    id: string;
    product_id: string | null;
    name: string;
    quantity: number;
    price: number;
    options: unknown;
  }>;
};

export async function getTableActiveOrders(
  restaurantId: string,
  tableNumber: number
): Promise<TableActiveOrder[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      table_number,
      status,
      notes,
      total,
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
    .eq("table_number", String(tableNumber))
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as TableActiveOrder[];
}

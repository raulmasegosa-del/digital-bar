"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export type CustomerOrderCounts = {
  received: number;
  preparing: number;
  served: number;
};

export async function getCustomerOrderCounts(
  restaurantId: string,
  table: string
): Promise<CustomerOrderCounts> {
  const tableNumber = table.trim();
  const empty = { received: 0, preparing: 0, served: 0 };
  if (!restaurantId || !tableNumber) return empty;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("status")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .in("status", ["pending", "preparing", "ready", "served", "bill"]);

  if (error) throw error;

  return (data ?? []).reduce<CustomerOrderCounts>((counts, row) => {
    if (row.status === "pending") counts.received += 1;
    else if (row.status === "preparing" || row.status === "ready") counts.preparing += 1;
    else if (row.status === "served" || row.status === "bill") counts.served += 1;
    return counts;
  }, { ...empty });
}

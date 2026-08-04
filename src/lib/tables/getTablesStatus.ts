import { supabaseAdmin } from "@/lib/supabase/server";

import {
  TableInfo,
  TableStatus,
} from "@/types/tables";

export async function getTablesStatus(): Promise<TableInfo[]> {
  const { data: orders, error } =
    await supabaseAdmin
      .from("orders")
      .select(`
        id,
        table_number,
        status,
        total,
        created_at,
        order_items(quantity)
      `)
      .neq("status", "cancelled");

  if (error) {
    throw error;
  }

  return (orders ?? []).map((order) => ({
    number: order.table_number,
    orderId: order.id,
status: order.status as TableStatus,
        total: Number(order.total ?? 0),
    createdAt: order.created_at,
    items:
      order.order_items?.reduce(
        (
          sum: number,
          item: { quantity: number }
        ) => sum + item.quantity,
        0
      ) ?? 0,
  }));
}
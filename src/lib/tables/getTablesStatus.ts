import { supabaseAdmin } from "@/lib/supabase/server";
import { TableInfo, TableStatus } from "@/types/tables";

const ACTIVE_STATUSES: TableStatus[] = [
  "pending",
  "preparing",
  "ready",
  "served",
  "bill",
];

export async function getTablesStatus(restaurantId: string): Promise<TableInfo[]> {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      table_number,
      status,
      total,
      created_at,
      order_items(quantity)
    `)
    .eq("restaurant_id", restaurantId)
    .in("status", ACTIVE_STATUSES);

  if (error) throw error;

  const tables = new Map<string, TableInfo>();

  for (const order of orders ?? []) {
    const number = String(order.table_number ?? "").trim();
    if (!number) continue;

    const quantity =
      order.order_items?.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      ) ?? 0;

    const existing = tables.get(number);

    if (!existing) {
      tables.set(number, {
        number,
        orderId: order.id,
        status: order.status as TableStatus,
        total: Number(order.total ?? 0),
        createdAt: order.created_at,
        items: quantity,
      });
      continue;
    }

    existing.total += Number(order.total ?? 0);
    existing.items += quantity;

    if (new Date(order.created_at) > new Date(existing.createdAt)) {
      existing.createdAt = order.created_at;
      existing.orderId = order.id;
      existing.status = order.status as TableStatus;
    }
  }

  return [...tables.values()].sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true })
  );
}

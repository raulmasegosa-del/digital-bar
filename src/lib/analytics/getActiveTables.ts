import { getOrders } from "@/app/admin/getOrders";

export async function getActiveTables() {
  const orders = await getOrders();

  const active = orders.filter(
    (o) =>
      o.status !== "served" &&
      o.status !== "cancelled"
  );

  return new Set(
    active.map(
      (o) => o.table_number
    )
  ).size;
}
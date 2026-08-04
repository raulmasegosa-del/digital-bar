import { getOrders } from "@/app/admin/getOrders";

export async function getRecentOrders(
  limit = 8
) {
  const orders = await getOrders();

  return orders.slice(0, limit);
}
import { getOrders } from "@/app/admin/getOrders";

export async function getDashboardStats() {
  const orders = await getOrders();

  const today = new Date().toDateString();

  const todayOrders = orders.filter(
    (o) =>
      new Date(
        o.created_at
      ).toDateString() === today
  );

  const sales = todayOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const pending = todayOrders.filter(
    (o) => o.status === "pending"
  ).length;

  const preparing =
    todayOrders.filter(
      (o) => o.status === "preparing"
    ).length;

  const ready = todayOrders.filter(
    (o) => o.status === "ready"
  ).length;

  const served =
    todayOrders.filter(
      (o) => o.status === "served"
    ).length;

  const averageTicket =
    todayOrders.length === 0
      ? 0
      : sales / todayOrders.length;

  return {
    sales,
    totalOrders:
      todayOrders.length,
    pending,
    preparing,
    ready,
    served,
    averageTicket,
  };
}
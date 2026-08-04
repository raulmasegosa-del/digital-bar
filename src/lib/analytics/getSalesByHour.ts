import { getOrders } from "@/app/admin/getOrders";

export async function getSalesByHour() {
  const orders = await getOrders();

  const today = new Date().toDateString();

  const hours = Array.from(
    { length: 24 },
    (_, hour) => ({
      hour,
      sales: 0,
    })
  );

  for (const order of orders) {
    if (
      new Date(
        order.created_at
      ).toDateString() !== today
    ) {
      continue;
    }

    const hour = new Date(
      order.created_at
    ).getHours();

    hours[hour].sales += order.total;
  }

  return hours;
}
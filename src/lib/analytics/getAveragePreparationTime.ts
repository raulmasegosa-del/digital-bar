import { getOrders } from "@/app/admin/getOrders";

export async function getAveragePreparationTime() {
  const orders = await getOrders();

  const served = orders.filter(
    (o) => o.status === "served"
  );

  if (served.length === 0)
    return 0;

  const totalMinutes = served.reduce(
    (sum, order) => {
      const created = new Date(
        order.created_at
      ).getTime();

      const finished = Date.now();

      return (
        sum +
        (finished - created) /
          60000
      );
    },
    0
  );

  return Math.round(
    totalMinutes / served.length
  );
}
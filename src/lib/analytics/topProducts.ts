import { getOrders } from "@/app/admin/getOrders";

export async function getTopProducts(
  limit = 5
) {
  const orders = await getOrders();

  const products = new Map<
    string,
    {
      id: string;
      name: string;
      quantity: number;
      revenue: number;
    }
  >();

  for (const order of orders) {
    for (const item of order.order_items) {
      const current =
        products.get(item.product_id);

      if (current) {
        current.quantity += item.quantity;

        current.revenue +=
          item.quantity * item.price;
      } else {
        products.set(item.product_id, {
          id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          revenue:
            item.quantity * item.price,
        });
      }
    }
  }

  return [...products.values()]
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )
    .slice(0, limit);
}
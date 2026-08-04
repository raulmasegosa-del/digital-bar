import type { Order } from "@/types/orders";

type Props = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        Últimos pedidos
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">
                Mesa {order.table_number}
              </p>

              <p className="text-sm text-gray-500">
                {order.order_items.length} productos
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-amber-600">
                {order.total.toFixed(2)} €
              </p>

              <p className="text-sm text-gray-500">
                {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
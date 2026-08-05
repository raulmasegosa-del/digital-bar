import type { Order } from "@/types/orders";

type Props = {
  orders: Order[];
};

const statusLabels = {
  pending: {
    text: "Pedido recibido",
    color:
      "bg-yellow-100 text-yellow-700",
  },
  preparing: {
    text: "Preparando",
    color:
      "bg-blue-100 text-blue-700",
  },
  ready: {
    text: "Listo",
    color:
      "bg-green-100 text-green-700",
  },
  served: {
    text: "Servido",
    color:
      "bg-emerald-100 text-emerald-700",
  },
  completed: {
    text: "Finalizado",
    color:
      "bg-gray-200 text-gray-700",
  },
  cancelled: {
    text: "Cancelado",
    color:
      "bg-red-100 text-red-700",
  },
};

export default function RecentOrders({
  orders,
}: Props) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Últimos pedidos
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
          {orders.length}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const status =
            statusLabels[
              order.status as keyof typeof statusLabels
            ];

          return (
            <article
              key={order.id}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-gray-100
                p-4
                transition-all
                duration-300
                hover:bg-gray-50
              "
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  Mesa {order.table_number}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {order.order_items.length}{" "}
                  {order.order_items.length ===
                  1
                    ? "producto"
                    : "productos"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {order.total.toFixed(2)} €
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                >
                  {status.text}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
import OrderActions from "@/components/admin/OrderActions";

import ElapsedTime from "@/components/business/ElapsedTime";

import StatusBadge from "@/components/kitchen/StatusBadge";

import { getOrderPriority } from "@/lib/orders/getOrderPriority";

import type { Order } from "@/types/orders";

type Props = {
  order: Order;
};

export default function KitchenCard({
  order,
}: Props) {
  const priority = getOrderPriority(
    order.created_at
  );

  const borderClass =
    priority === "urgent"
      ? "border-red-500"
      : priority === "warning"
      ? "border-amber-400"
      : "border-gray-200";

  return (
    <article
      className={`
        rounded-2xl
        border-2
        ${borderClass}
        bg-white
        p-6
        shadow-lg
        transition-all
      `}
    >
      {/* Cabecera */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Mesa {order.table}
          </h2>

          <div className="mt-2">
            <ElapsedTime
              from={order.created_at}
            />
          </div>
        </div>

        <StatusBadge
          status={order.status}
        />
      </div>

      {/* Productos */}

      <div className="space-y-4">
        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="border-b pb-3 last:border-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">
                  {item.quantity} × {item.name}
                </p>

                {item.options.length >
                  0 && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-500">
                    {item.options.map(
                      (
                        option,
                        index
                      ) => (
                        <li
                          key={index}
                        >
                          •{" "}
                          {
                            option.optionName
                          }
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>

              <span className="font-semibold">
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}{" "}
                €
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Observaciones */}

      {order.notes && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">
            📝 Observaciones
          </p>

          <p className="mt-2 text-sm">
            {order.notes}
          </p>
        </div>
      )}

      {/* Total */}

      <div className="mt-6 flex items-center justify-between border-t pt-5">
        <span className="font-semibold">
          Total
        </span>

        <span className="text-2xl font-bold text-emerald-600">
          {order.total.toFixed(2)} €
        </span>
      </div>

      {/* Acciones */}

      <div className="mt-6">
        <OrderActions
          orderId={order.id}
          currentStatus={
            order.status
          }
        />
      </div>
    </article>
  );
}
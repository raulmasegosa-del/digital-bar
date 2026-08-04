import OrderActions from "@/components/admin/OrderActions";
import OrderTimer from "@/components/kitchen/OrderTimer";
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

  let borderClass = "border-gray-200";

  switch (priority) {
    case "warning":
      borderClass = "border-amber-400";
      break;

    case "urgent":
      borderClass = "border-red-500";
      break;
  }

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
        duration-300
      `}
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Mesa {order.table}
          </h2>

          <OrderTimer
            createdAt={order.created_at}
          />
        </div>

        <StatusBadge
          status={order.status}
        />
      </div>

      <div className="mb-5 space-y-3">
        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="border-b pb-3 last:border-b-0"
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {item.quantity} × {item.name}
              </span>

              <span>
                {(item.price * item.quantity).toFixed(2)} €
              </span>
            </div>

            {item.options.length > 0 && (
              <ul className="mt-1 text-sm text-gray-500">
                {item.options.map(
                  (option, index) => (
                    <li key={index}>
                      • {option.optionName}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-5 rounded-xl bg-amber-50 p-3">
          <p className="font-semibold">
            📝 Observaciones
          </p>

          <p className="text-sm">
            {order.notes}
          </p>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between border-t pt-4">
        <span className="font-semibold">
          Total
        </span>

        <span className="text-lg font-bold text-green-600">
          {order.total.toFixed(2)} €
        </span>
      </div>

      <OrderActions
        orderId={order.id}
        currentStatus={order.status}
      />
    </article>
  );
}
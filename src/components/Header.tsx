"use client";

import { useOrder } from "@/context/OrderContext";
import { useTable } from "@/context/TableContext";

type Props = {
  restaurantName: string;
};

const status = {
  pending: {
    text: "Pedido recibido",
    color: "bg-yellow-100 text-yellow-700",
    icon: "🟡",
  },
  preparing: {
    text: "Preparando",
    color: "bg-blue-100 text-blue-700",
    icon: "👨‍🍳",
  },
  ready: {
    text: "Pedido listo",
    color: "bg-green-100 text-green-700",
    icon: "🍽️",
  },
  served: {
    text: "Servido",
    color: "bg-emerald-100 text-emerald-700",
    icon: "✅",
  },
  bill: {
    text: "Pendiente de cobro",
    color: "bg-orange-100 text-orange-700",
    icon: "💰",
  },
  completed: {
    text: "Finalizado",
    color: "bg-gray-100 text-gray-700",
    icon: "✔️",
  },
  cancelled: {
    text: "Cancelado",
    color: "bg-red-100 text-red-700",
    icon: "❌",
  },
} as const;

export default function Header({
  restaurantName,
}: Props) {
  const { table } = useTable();
  const { order } = useOrder();

  const currentStatus = order
    ? status[order.status]
    : status.pending;

  return (
    <header className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h1 className="text-5xl font-black tracking-tight">
          🍻 {restaurantName}
        </h1>

        <p className="mt-3 text-lg text-amber-100">
          Haz tu pedido desde la mesa
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {table && (
            <div
              className="
                rounded-full
                bg-white/20
                px-5
                py-2
                font-semibold
                backdrop-blur
              "
            >
              🪑 Mesa {table}
            </div>
          )}

          {order && (
            <div
              className={`
                rounded-full
                px-5
                py-2
                font-semibold
                ${currentStatus.color}
              `}
            >
              {currentStatus.icon} {currentStatus.text}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
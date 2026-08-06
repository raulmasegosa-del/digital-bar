"use client";

import { barConfig } from "@/config";

import { useOrder } from "@/context/OrderContext";
import { useTable } from "@/context/TableContext";

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

export default function Header() {
  const { table } = useTable();
  const { order } = useOrder();

  const currentStatus = order
    ? status[order.status]
    : status.pending;

  return (
    <header
      className="
        mb-8
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-amber-700
        via-amber-600
        to-orange-500
        p-8
        text-white
        shadow-2xl
      "
    >
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          🍻 {barConfig.name}
        </h1>

        <p className="mt-3 text-lg text-amber-100">
          {barConfig.slogan}
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
              {currentStatus.icon}{" "}
              {currentStatus.text}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
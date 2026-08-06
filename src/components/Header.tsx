"use client";

import { barConfig } from "@/config";
import { useOrder } from "@/context/OrderContext";
import { useTable } from "@/context/TableContext";

export default function Header() {
  const { table } = useTable();
  const { order } = useOrder();

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
    cancelled: {
      text: "Cancelado",
      color: "bg-red-100 text-red-700",
      icon: "❌",
    },
  } as const;

  const currentStatus = order ? status[order.status] : status.pending;

  return (
    <header className="w-full p-4 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{barConfig.name}</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {table ? `Mesa ${table.number}` : "Sin mesa seleccionada"}
          </h1>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 ${currentStatus.color}`}>
          <span>{currentStatus.icon}</span>
          <span className="text-sm font-medium">{currentStatus.text}</span>
        </div>
      </div>
    </header>
  );
}

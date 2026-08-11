"use client";

import { useOrder } from "@/context/OrderContext";
import { useTable } from "@/context/TableContext";

type Props = {
  restaurantName: string;
};

const status = {
  pending: { text: "Pedido recibido", color: "border-amber-500/30 bg-amber-500/10 text-amber-300", icon: "🟡" },
  preparing: { text: "Preparando", color: "border-blue-500/30 bg-blue-500/10 text-blue-300", icon: "👨‍🍳" },
  ready: { text: "Pedido listo", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: "🍽️" },
  served: { text: "Servido", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", icon: "✅" },
  bill: { text: "Pendiente de cobro", color: "border-orange-500/30 bg-orange-500/10 text-orange-300", icon: "💰" },
  completed: { text: "Finalizado", color: "border-zinc-700 bg-zinc-900 text-zinc-300", icon: "✔️" },
  cancelled: { text: "Cancelado", color: "border-red-500/30 bg-red-500/10 text-red-300", icon: "❌" },
} as const;

export default function Header({ restaurantName }: Props) {
  const { table } = useTable();
  const { order } = useOrder();
  const currentStatus = order ? status[order.status] : null;

  return (
    <header className="border-b border-zinc-800 bg-[#181716] text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Digital Bar
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {restaurantName}
            </h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Haz tu pedido directamente desde la mesa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {table && (
              <div className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200">
                🪑 Mesa {table}
              </div>
            )}
            {currentStatus && (
              <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${currentStatus.color}`}>
                {currentStatus.icon} {currentStatus.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

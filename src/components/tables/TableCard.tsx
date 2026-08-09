import Link from "next/link";

import { getElapsedMinutes } from "@/lib/time/getElapsedMinutes";

import type { TableStatus } from "@/types/tables";

type Props = {
  number: string;
  status: TableStatus;
  total: number;
  items: number;
  createdAt: string;
};

const styles = {
  free: {
    color: "bg-gray-50 border-gray-200",
    badge: "⚪ Libre",
  },
  pending: {
    color: "bg-amber-50 border-amber-300",
    badge: "🟡 Pedido recibido",
  },
  preparing: {
    color: "bg-blue-50 border-blue-300",
    badge: "👨‍🍳 Preparando",
  },
  ready: {
    color: "bg-green-50 border-green-300",
    badge: "🍽️ Listo",
  },
  served: {
    color: "bg-emerald-50 border-emerald-300",
    badge: "🍻 Comiendo",
  },
  bill: {
    color: "bg-red-50 border-red-300",
    badge: "💰 Cobro",
  },
  completed: {
    color: "bg-gray-100 border-gray-300",
    badge: "✅ Finalizada",
  },
  cancelled: {
    color: "bg-red-100 border-red-300",
    badge: "❌ Cancelada",
  },
};

export default function TableCard({
  number,
  status,
  total,
  items,
  createdAt,
}: Props) {
  const style = styles[status];

  const minutes = getElapsedMinutes(createdAt);

  return (
    <Link
      href={`/admin/tables/${number}`}
      className={`
        block
        rounded-2xl
        border-2
        ${style.color}
        p-6
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-3xl font-bold">
          Mesa {number}
        </h2>

        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
          {style.badge}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Productos
          </p>

          <p className="mt-1 text-xl font-bold">
            {items}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total
          </p>

          <p className="mt-1 text-xl font-bold">
            {total.toFixed(2)} €
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Tiempo
          </p>

          <p className="mt-1 text-xl font-bold">
            {minutes} min
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white/70 py-3 text-center font-semibold">
        Abrir mesa →
      </div>
    </Link>
  );
}
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
    people: 0,
  },
  pending: {
    color: "bg-amber-50 border-amber-300",
    badge: "🟡 Pedido recibido",
    people: 1,
  },
  preparing: {
    color: "bg-blue-50 border-blue-300",
    badge: "👨‍🍳 Preparando",
    people: 1,
  },
  ready: {
    color: "bg-green-50 border-green-300",
    badge: "🍽️ Listo",
    people: 2,
  },
  served: {
    color: "bg-emerald-50 border-emerald-300",
    badge: "🍻 Comiendo",
    people: 2,
  },
  bill: {
    color: "bg-red-50 border-red-300",
    badge: "💰 Cobro",
    people: 2,
  },
  completed: {
    color: "bg-gray-100 border-gray-300",
    badge: "✅ Finalizada",
    people: 0,
  },
  cancelled: {
    color: "bg-red-100 border-red-300",
    badge: "❌ Cancelada",
    people: 0,
  },
};

function Person({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-lg shadow-md ${className}`}
    >
      🧑
    </span>
  );
}

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
      className={`block rounded-2xl border-2 ${style.color} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-3xl font-bold">Mesa {number}</h2>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
          {style.badge}
        </span>
      </div>

      <div className="relative mx-auto mt-5 flex h-32 max-w-xs items-center justify-center">
        <div className="absolute z-10 h-16 w-36 rounded-2xl border-4 border-zinc-700 bg-zinc-200 shadow-lg" />
        <div className="absolute z-10 h-3 w-24 rounded-full bg-zinc-300" />

        {style.people >= 1 && <Person className="-left-1 top-1/2 -translate-y-1/2" />}
        {style.people >= 2 && <Person className="-right-1 top-1/2 -translate-y-1/2" />}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Productos</p>
          <p className="mt-1 text-xl font-bold">{items}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
          <p className="mt-1 text-xl font-bold">{total.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Tiempo</p>
          <p className="mt-1 text-xl font-bold">{minutes} min</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white/70 py-3 text-center font-semibold">Abrir mesa →</div>
    </Link>
  );
}

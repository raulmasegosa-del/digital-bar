import Link from "next/link";

import { getElapsedMinutes } from "@/lib/time/getElapsedMinutes";

type Props = {
  number: string;
  status:
    | "free"
    | "pending"
    | "preparing"
    | "ready"
    | "served"
    | "bill";
  total: number;
  items: number;
  createdAt?: string;
};

const styles = {
  free: {
    color: "bg-gray-100",
    icon: "⚪",
    text: "Libre",
  },
  pending: {
    color: "bg-yellow-100",
    icon: "🟡",
    text: "Pedido recibido",
  },
  preparing: {
    color: "bg-blue-100",
    icon: "👨‍🍳",
    text: "Preparando",
  },
  ready: {
    color: "bg-green-100",
    icon: "🍽️",
    text: "Listo",
  },
  served: {
    color: "bg-emerald-100",
    icon: "🍻",
    text: "Comiendo",
  },
  bill: {
    color: "bg-red-100",
    icon: "💶",
    text: "Pide cuenta",
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

  const minutes = createdAt
    ? getElapsedMinutes(createdAt)
    : null;

  const border =
    minutes === null
      ? "border-gray-200"
      : minutes < 10
      ? "border-green-500"
      : minutes < 20
      ? "border-yellow-500"
      : "border-red-500";

  return (
    <article
      className={`${style.color} ${border} rounded-2xl border-2 p-6 shadow transition hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Mesa {number}
        </h3>

        <span className="text-3xl">
          {style.icon}
        </span>
      </div>

      <p className="mt-3 text-lg font-medium">
        {style.text}
      </p>

      <div className="mt-5 space-y-2 text-sm text-gray-700">
        <p>
          🍔 {items}{" "}
          {items === 1
            ? "producto"
            : "productos"}
        </p>

        <p>
          💶 {total.toFixed(2)} €
        </p>

        {minutes !== null && (
          <p>
            ⏱️ Hace {minutes} min
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link
          href={`/admin/tables/${number}`}
          className="block rounded-xl bg-amber-600 px-4 py-2 text-center font-medium text-white transition hover:bg-amber-700"
        >
          Ver pedido
        </Link>
      </div>
    </article>
  );
}
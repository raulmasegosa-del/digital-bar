import type { OrderStatus } from "@/types/orders";

type Props = {
  status: OrderStatus;
};

export default function StatusBadge({
  status,
}: Props) {
  switch (status) {
    case "pending":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-700">
          🟡 Nuevo
        </span>
      );

    case "preparing":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
          👨‍🍳 Preparando
        </span>
      );

    case "ready":
      return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
          🍽️ Listo
        </span>
      );

    case "served":
      return (
        <span className="rounded-full bg-gray-200 px-3 py-1 font-semibold text-gray-700">
          ✅ Servido
        </span>
      );

    case "cancelled":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
          ❌ Cancelado
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
          {status}
        </span>
      );
  }
}
import type { OrderStatus } from "@/types/orders";

type Props = {
  status: OrderStatus;
};

const statusConfig = {
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
} satisfies Record<
  OrderStatus,
  {
    text: string;
    color: string;
    icon: string;
  }
>;

export default function OrderStatusBadge({
  status,
}: Props) {
  const current = statusConfig[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-4
        py-2
        text-sm
        font-semibold
        ${current.color}
      `}
    >
      <span>{current.icon}</span>
      <span>{current.text}</span>
    </span>
  );
}
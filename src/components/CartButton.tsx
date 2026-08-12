"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";

import type { OrderStatus } from "@/types/orders";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const statusConfig = {
  pending: {
    icon: "🟡",
    text: "Pedido recibido",
    color: "bg-yellow-500",
  },
  preparing: {
    icon: "👨‍🍳",
    text: "Preparando",
    color: "bg-blue-600",
  },
  ready: {
    icon: "🍽️",
    text: "Pedido listo",
    color: "bg-green-600 animate-bounce",
  },
  served: {
    icon: "✅",
    text: "Servido",
    color: "bg-gray-600",
  },
  bill: {
    icon: "💰",
    text: "Pendiente de cobro",
    color: "bg-orange-600",
  },
  completed: {
    icon: "✔️",
    text: "Finalizado",
    color: "bg-gray-600",
  },
  cancelled: {
    icon: "❌",
    text: "Cancelado",
    color: "bg-red-600",
  },
} satisfies Record<
  OrderStatus,
  {
    icon: string;
    text: string;
    color: string;
  }
>;

export default function CartButton({
  onClick,
  disabled = false,
}: Props) {
  const { items } = useCart();
  const { order } = useOrder();

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const orderCount = order?.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) ?? 0;

  const count = Math.max(cartCount, orderCount);

  if (order) {
    const status = statusConfig[order.status];

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Ver pedido y seguir pidiendo"
        className={`fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full px-6 py-4 text-white shadow-2xl transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 ${status.color}`}
      >
        <div className="relative">
          <span className="text-2xl">{status.icon}</span>
          {count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <div className="text-left">
          <p className="text-xs opacity-80">{status.text}</p>
          <p className="font-semibold">Ver pedido · Seguir pidiendo</p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-4 rounded-full bg-amber-600 px-6 py-4 text-white shadow-2xl transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="relative">
        <ShoppingCart size={26} />
        {cartCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </div>
      <div className="text-left">
        <p className="text-xs opacity-80">Tu pedido</p>
        <p className="font-semibold">Ver carrito</p>
      </div>
    </button>
  );
}

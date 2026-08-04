"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export default function CartButton({
  onClick,
  disabled = false,
}: Props) {
  const { items } = useCart();
  const { order } = useOrder();

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (order) {
    const status = {
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
      cancelled: {
        icon: "❌",
        text: "Cancelado",
        color: "bg-red-600",
      },
    }[order.status];

    return (
      <div
        className={`
          fixed
          bottom-5
          right-5
          z-40
          flex
          items-center
          gap-3
          rounded-full
          px-6
          py-4
          text-white
          shadow-2xl
          ${status.color}
        `}
      >
        <span className="text-2xl">
          {status.icon}
        </span>

        <div>
          <p className="text-xs opacity-80">
            Pedido
          </p>

          <p className="font-semibold">
            {status.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        fixed
        bottom-5
        right-5
        z-40
        flex
        items-center
        gap-3
        rounded-full
        bg-amber-600
        px-6
        py-4
        text-white
        shadow-2xl
        transition-all
        duration-300
        hover:scale-105
        hover:bg-amber-700
        disabled:opacity-50
      "
    >
      <div className="relative">
        <ShoppingCart size={26} />

        {count > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-red-500
              text-xs
              font-bold
              text-white
            "
          >
            {count}
          </span>
        )}
      </div>

      <div className="text-left">
        <p className="text-xs opacity-80">
          Tu pedido
        </p>

        <p className="font-semibold">
          Ver carrito
        </p>
      </div>
    </button>
  );
}
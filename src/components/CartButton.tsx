"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  onClick: () => void;
};

export default function CartButton({
  onClick,
}: Props) {
const { items } = useCart();

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-amber-600 px-6 py-4 text-white shadow-xl transition hover:bg-amber-700"
    >
      <span className="text-2xl">🛒</span>

      <span className="font-semibold">
        {count} artículo{count !== 1 ? "s" : ""}
      </span>
    </button>
  );
}
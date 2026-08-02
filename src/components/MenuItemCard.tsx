"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductOptionsModal from "@/components/ProductOptionsModal";

type Props = {
  item: any;
};

export default function MenuItemCard({
  item,
}: Props) {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();

  const hasOptions =
    item.option_groups &&
    item.option_groups.length > 0;

  function handleAdd() {
    if (hasOptions) {
      setOpen(true);
      return;
    }

    addItem({
      productId: item.id,
      name: item.name,
      price: Number(item.prices?.[0]?.price ?? 0),
      quantity: 1,
      options: [],
    });
  }

  return (
    <>
      <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold">
              {item.name}
            </h3>

            {item.description && (
              <p className="mt-2 text-sm text-gray-500">
                {item.description}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-amber-600">
              {Number(
                item.prices?.[0]?.price ?? 0
              ).toFixed(2)} €
            </p>

            <button
              onClick={handleAdd}
              className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>

      {hasOptions && (
        <ProductOptionsModal
  open={open}
  onClose={() => setOpen(false)}
  item={item}
/>
      )}
    </>
  );
}
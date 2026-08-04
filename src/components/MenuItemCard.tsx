"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";

import ProductOptionsModal from "@/components/ProductOptionsModal";

type Props = {
  item: any;
};

export default function MenuItemCard({
  item,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const { addItem } =
    useCart();

  const { order } =
    useOrder();

  const { showToast } =
    useToast();

  const hasOptions =
    item.option_groups?.length > 0;

  function handleAdd() {
    if (order) {
      showToast(
        "🍽️ Ya tienes un pedido en curso."
      );
      return;
    }

    if (hasOptions) {
      setOpen(true);
      return;
    }

    addItem({
      productId: item.id,
      name: item.name,
      price: Number(
        item.prices?.[0]?.price ?? 0
      ),
      quantity: 1,
      options: [],
    });

    showToast(
      `✅ ${item.name} añadido`
    );
  }

  return (
    <>
      <article
        className="
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-52 w-full object-cover"
          />
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold">
                {item.name}
              </h3>

              {item.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-amber-600">
                {Number(
                  item.prices?.[0]?.price ?? 0
                ).toFixed(2)}
                €
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!!order}
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-amber-600
              py-3
              font-semibold
              text-white
              transition
              hover:bg-amber-700
              disabled:opacity-50
            "
          >
            <Plus size={18} />
            Añadir
          </button>
        </div>
      </article>

      {hasOptions && (
        <ProductOptionsModal
          open={open}
          onClose={() =>
            setOpen(false)
          }
          item={item}
        />
      )}
    </>
  );
}
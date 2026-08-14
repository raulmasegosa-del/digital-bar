"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import ProductOptionsModal from "@/components/ProductOptionsModal";

type Props = { item: any };

export default function MenuItemCard({ item }: Props) {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const { order } = useOrder();
  const { showToast } = useToast();
  const hasOptions = item.option_groups?.length > 0;
  const imageUrl = typeof item.image === "string" ? item.image.trim() : "";

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

    showToast(`✅ ${item.name} añadido al carrito`);
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716] shadow-sm transition-all duration-200 hover:border-zinc-700 hover:shadow-xl">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-48 w-full object-cover sm:h-56"
          />
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold tracking-tight text-white">{item.name}</h3>
              {item.description && <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>}
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xl font-extrabold text-amber-500">{Number(item.prices?.[0]?.price ?? 0).toFixed(2)}€</div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500 px-4 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            <Plus size={18} />
            {order ? "Añadir al carrito" : "Añadir al pedido"}
          </button>
        </div>
      </article>

      {hasOptions && (
        <ProductOptionsModal open={open} onClose={() => setOpen(false)} item={item} />
      )}
    </>
  );
}

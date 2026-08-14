"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useTable } from "@/context/TableContext";
import { useToast } from "@/context/ToastContext";
import ProductOptionsModal from "@/components/ProductOptionsModal";

type Props = { item: any };
const CLOSED_MESSAGE = "La sesión ha finalizado. Lee de nuevo el QR de la mesa para continuar.";

export default function MenuItemCard({ item }: Props) {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const { order } = useOrder();
  const { sessionToken, sessionError } = useTable();
  const { showToast } = useToast();
  const hasOptions = item.option_groups?.length > 0;
  const imageUrl = typeof item.image === "string" ? item.image.trim() : "";
  const sessionActive = Boolean(sessionToken);

  function handleAdd() {
    if (!sessionActive) {
      showToast(sessionError || CLOSED_MESSAGE);
      return;
    }

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
        <div className="flex min-h-32 items-stretch">
          {imageUrl && (
            <div className="w-28 shrink-0 self-stretch sm:w-36">
              <img src={imageUrl} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{item.name}</h3>
                {item.description && <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-zinc-400">{item.description}</p>}
              </div>
              <div className="shrink-0 text-right"><div className="text-lg font-extrabold text-amber-500 sm:text-xl">{Number(item.prices?.[0]?.price ?? 0).toFixed(2)}€</div></div>
            </div>

            <button
              onClick={handleAdd}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500 px-4 py-2.5 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              {sessionActive ? (order ? "Añadir al carrito" : "Añadir al pedido") : "Sesión finalizada — leer QR"}
            </button>
          </div>
        </div>
      </article>

      {hasOptions && <ProductOptionsModal open={open} onClose={() => setOpen(false)} item={item} />}
    </>
  );
}

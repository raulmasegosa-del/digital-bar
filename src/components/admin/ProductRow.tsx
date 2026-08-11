import Link from "next/link";
import {
  Image as ImageIcon,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import ProductAvailabilitySwitch from "@/components/admin/ProductAvailabilitySwitch";

import type { AdminProduct } from "@/types/admin";

type Props = {
  item: AdminProduct;
  slug: string;
};

export default function ProductRow({
  item,
  slug,
}: Props) {
  const price = item.menu_prices?.length
    ? `${Number(item.menu_prices[0].price).toFixed(2)} €`
    : "-";

  return (
    <tr className="group border-t border-zinc-800/80 transition-colors duration-150 hover:bg-[#1c1a18]">
      {/* Producto */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Imagen */}
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-700">
                <ImageIcon
                  size={19}
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="min-w-0">
            <p className="font-medium text-white transition-colors group-hover:text-amber-400">
              {item.name}
            </p>

            {item.subtitle && (
              <p className="mt-0.5 truncate text-sm text-zinc-500">
                {item.subtitle}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Categoría */}
      <td className="px-4 py-3">
        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
          {item.categories?.name ?? "Sin categoría"}
        </span>
      </td>

      {/* Precio */}
      <td className="whitespace-nowrap px-4 py-3">
        <span className="font-semibold text-white">
          {price}
        </span>
      </td>

      {/* Disponible */}
      <td className="px-4 py-3 text-center">
        <div className="flex min-h-11 items-center justify-center">
          <ProductAvailabilitySwitch
            id={item.id}
            available={item.available}
          />
        </div>
      </td>

      {/* Destacado */}
      <td className="px-4 py-3 text-center">
        <div className="flex min-h-11 items-center justify-center">
          {item.featured ? (
            <Star
              size={18}
              strokeWidth={1.7}
              className="text-amber-400"
              fill="currentColor"
            />
          ) : (
            <span className="text-zinc-700">
              —
            </span>
          )}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/${slug}/products/${item.id}`}
            aria-label={`Editar ${item.name}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/60 text-zinc-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
          >
            <Pencil
              size={18}
              strokeWidth={1.8}
            />
          </Link>

          <button
            type="button"
            aria-label={`Eliminar ${item.name}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-500 transition-colors hover:border-red-900/60 hover:bg-red-950/30 hover:text-red-400 active:scale-95"
          >
            <Trash2
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
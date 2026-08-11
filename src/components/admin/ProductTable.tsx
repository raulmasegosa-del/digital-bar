"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { AdminProduct } from "@/types/admin";

import EmptyState from "@/components/ui/EmptyState";

import ProductRow from "./ProductRow";

type Props = {
  items: AdminProduct[];
  slug: string;
};

export default function ProductTable({
  items,
  slug,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.categories?.name
          ?.toLowerCase()
          .includes(term)
    );
  }, [items, search]);

  return (
    <section>
      {/* Barra superior */}
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Search
            size={17}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar producto o categoría..."
            className="h-12 w-full rounded-xl border border-zinc-800 bg-[#181716] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/40 focus:bg-[#1c1a18]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">
            {filteredItems.length}
          </span>

          <span className="text-xs uppercase tracking-[0.16em] text-zinc-600">
            {filteredItems.length === 1
              ? "producto"
              : "productos"}
          </span>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-8">
          <EmptyState
            title="No se han encontrado productos."
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-zinc-800 bg-[#151413]">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Categoría
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Precio
                  </th>

                  <th className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Disponible
                  </th>

                  <th className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Destacado
                  </th>

                  <th className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <ProductRow
                    key={item.id}
                    item={item}
                    slug={slug}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

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
  const [category, setCategory] = useState("all");

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    items.forEach((item) => {
      const categoryName = item.categories?.name;

      if (categoryName) {
        uniqueCategories.add(categoryName);
      }
    });

    return Array.from(uniqueCategories).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [items]);

  // Aplicar búsqueda + categoría
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.categories?.name
          ?.toLowerCase()
          .includes(term);

      const matchesCategory =
        category === "all" ||
        item.categories?.name === category;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <section>
      {/* Filtros de categoría */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal
            size={13}
            strokeWidth={1.7}
            className="text-zinc-600"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Categoría
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`min-h-11 shrink-0 rounded-xl border px-4 text-xs font-medium transition-colors ${
              category === "all"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 bg-[#181716] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            Todas
          </button>

          {categories.map((categoryName) => (
            <button
              key={categoryName}
              type="button"
              onClick={() =>
                setCategory(categoryName)
              }
              className={`min-h-11 shrink-0 rounded-xl border px-4 text-xs font-medium transition-colors ${
                category === categoryName
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-zinc-800 bg-[#181716] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Buscador + contador */}
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-4xl">
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

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-medium text-zinc-400">
            {filteredItems.length}
          </span>

          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            {filteredItems.length === 1
              ? "producto"
              : "productos"}
          </span>
        </div>
      </div>

      {/* Resultados */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-8">
          <EmptyState
            title="No se han encontrado productos."
          />
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-zinc-800 bg-[#151413]">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Producto
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Categoría
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Precio
                  </th>

                  <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Disponible
                  </th>

                  <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Destacado
                  </th>

                  <th className="w-[130px] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
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
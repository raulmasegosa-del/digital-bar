"use client";

import { useMemo, useState } from "react";

import type { AdminProduct } from "@/types/admin";

import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";

import ProductRow from "./ProductRow";

type Props = {
  items: AdminProduct[];
};

export default function ProductTable({
  items,
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
    <section className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <SearchInput
          value={search}
          onChange={setSearch}
        />

        <p className="text-sm text-gray-500">
          {filteredItems.length} producto
          {filteredItems.length !== 1 && "s"}
        </p>

      </div>

      {filteredItems.length === 0 ? (
        <EmptyState title="No se han encontrado productos." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <table className="min-w-full">

            <thead className="border-b bg-gray-50">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Producto
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Categoría
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Precio
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Disponible
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Destacado
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                />
              ))}
            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}
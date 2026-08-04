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
  const [search, setSearch] =
    useState("");

  const filteredItems =
    useMemo(() => {
      const term =
        search.toLowerCase();

      return items.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(term) ||
          item.categories?.name
            ?.toLowerCase()
            .includes(term)
      );
    }, [items, search]);

  return (
    <div className="space-y-5">
      <SearchInput
        value={search}
        onChange={setSearch}
      />

      {filteredItems.length === 0 ? (
        <EmptyState title="No se han encontrado productos." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow">
          <table className="w-full">
            <thead className="bg-amber-100">
              <tr>
                <th className="p-3 text-left">
                  Producto
                </th>

                <th className="p-3 text-left">
                  Categoría
                </th>

                <th className="p-3 text-left">
                  Precio
                </th>

                <th className="p-3 text-center">
                  Disponible
                </th>

                <th className="p-3 text-center">
                  ⭐
                </th>

                <th className="p-3 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map(
                (item) => (
                  <ProductRow
                    key={item.id}
                    item={item}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
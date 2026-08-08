"use client";

import { useMemo, useState } from "react";

import SearchBar from "@/components/SearchBar";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuItemCard from "@/components/MenuItemCard";
import { normalizeSearch } from "@/lib/normalizeSearch";

type Props = {
  menu: any[];
};

export default function MenuClient({
  menu,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredMenu = useMemo(() => {
    if (!search.trim()) {
      return menu;
    }

    const text = normalizeSearch(search);

    return menu
      .map((category) => ({
        ...category,

        items: category.items.filter(
          (item: any) => {
            const product =
              normalizeSearch(item.name);

            const categoryName =
              normalizeSearch(category.name);

            return (
              product.includes(text) ||
              categoryName.includes(text)
            );
          }
        ),
      }))
      .filter(
        (category) =>
          category.items.length > 0
      );
  }, [menu, search]);

  const totalResults =
    filteredMenu.reduce(
      (total, category) =>
        total + category.items.length,
      0
    );

  return (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {!search.trim() && (
        <CategoryNavigation
          categories={filteredMenu}
        />
      )}

      {search.trim() && (
        <p className="mb-6 text-sm text-gray-500">
          {totalResults === 0
            ? "😕 No se han encontrado productos."
            : totalResults === 1
            ? "🔍 1 producto encontrado"
            : `🔍 ${totalResults} productos encontrados`}
        </p>
      )}

      <div className="space-y-12">
        {filteredMenu.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-28"
          >
            <h2 className="mb-5 text-3xl font-bold text-amber-700">
              {category.icon} {category.name}
            </h2>

            <div className="space-y-4">
              {category.items.map(
                (item: any) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                  />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
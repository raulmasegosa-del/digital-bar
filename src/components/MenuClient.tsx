"use client";

import { useMemo, useState } from "react";

import SearchBar from "@/components/SearchBar";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuItemCard from "@/components/MenuItemCard";
import { normalizeSearch } from "@/lib/normalizeSearch";

type Props = { menu: any[] };

export default function MenuClient({ menu }: Props) {
  const [search, setSearch] = useState("");

  const filteredMenu = useMemo(() => {
    if (!search.trim()) return menu;
    const text = normalizeSearch(search);
    return menu
      .map((category) => ({
        ...category,
        items: category.items.filter((item: any) => {
          const product = normalizeSearch(item.name);
          const categoryName = normalizeSearch(category.name);
          return product.includes(text) || categoryName.includes(text);
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, search]);

  const totalResults = filteredMenu.reduce(
    (total, category) => total + category.items.length,
    0
  );

  return (
    <>
      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {!search.trim() && <CategoryNavigation categories={filteredMenu} />}

      {search.trim() && (
        <p className="mb-6 text-sm text-zinc-500">
          {totalResults === 0
            ? "😕 No se han encontrado productos."
            : totalResults === 1
              ? "🔍 1 producto encontrado"
              : `🔍 ${totalResults} productos encontrados`}
        </p>
      )}

      <div className="space-y-10">
        {filteredMenu.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {category.icon} {category.name}
              </h2>
              <span className="text-xs font-medium text-zinc-600">
                {category.items.length} {category.items.length === 1 ? "producto" : "productos"}
              </span>
            </div>

            <div className="space-y-4">
              {category.items.map((item: any) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

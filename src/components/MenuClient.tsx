"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import SearchBar from "@/components/SearchBar";
import CategoryNavigation from "@/components/CategoryNavigation";
import MenuItemCard from "@/components/MenuItemCard";
import { normalizeSearch } from "@/lib/normalizeSearch";

type Props = { menu: any[] };

export default function MenuClient({ menu }: Props) {
  const [search, setSearch] = useState("");
  const categoryNavigationUntil = useRef(0);

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

  useEffect(() => {
    if (search.trim() || filteredMenu.length === 0) return;

    const markCategoryNavigation = () => {
      // Keep the infinite-scroll wrap disabled while a category button is
      // performing its smooth scroll, especially for the last category.
      categoryNavigationUntil.current = Date.now() + 1200;
    };

    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const reachedEnd = viewportBottom >= documentHeight - 24;

      if (!reachedEnd || Date.now() < categoryNavigationUntil.current) return;

      const firstCategory = document.getElementById(`menu-category-${filteredMenu[0].id}`);
      if (!firstCategory) return;

      window.scrollTo({
        top: Math.max(0, firstCategory.offsetTop - 110),
        behavior: "instant" as ScrollBehavior,
      });
    };

    window.addEventListener("digital-bar:category-navigation", markCategoryNavigation);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("digital-bar:category-navigation", markCategoryNavigation);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredMenu, search]);

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

      <div className="space-y-12">
        {filteredMenu.map((category) => (
          <section
            key={category.id}
            id={`menu-category-${category.id}`}
            className="scroll-mt-28"
          >
            <div className="mb-5 border-b border-zinc-800/80 pb-4">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {category.icon} {category.name}
              </h2>
              <span className="mt-1 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
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

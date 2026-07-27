"use client";

import { useState } from "react";

import SearchBar from "@/components/SearchBar";
import CategorySection from "@/components/CategorySection";

import { categories, items } from "@/data";
import { getItemsByCategory } from "@/lib/menu";

export default function Menu() {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      (item.subtitle?.toLowerCase().includes(text) ?? false)
    );
  });

  return (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {categories.map((category) => {
        const categoryItems = getItemsByCategory(
          filteredItems,
          category.id
        );

        return (
          <CategorySection
            key={category.id}
            category={category}
            items={categoryItems}
          />
        );
      })}
    </>
  );
}
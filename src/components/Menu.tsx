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
      {search && (
  <p className="mb-6 text-sm text-gray-600">
    {filteredItems.length === 0
      ? "No se encontraron productos."
      : `${filteredItems.length} producto${
          filteredItems.length === 1 ? "" : "s"
        } encontrado${
          filteredItems.length === 1 ? "" : "s"
        }`}
  </p>
)}

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
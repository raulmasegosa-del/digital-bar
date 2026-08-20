"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  icon?: string;
};

type Props = {
  categories: Category[];
};

function sectionId(categoryId: string) {
  return `menu-category-${categoryId}`;
}

export default function CategoryNavigation({ categories }: Props) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    setActive(categories[0]?.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const firstVisible = visible[0];
        if (firstVisible) {
          const categoryId = firstVisible.target.id.replace(/^menu-category-/, "");
          setActive(categoryId);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    categories.forEach((category) => {
      const element = document.getElementById(sectionId(category.id));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (!categories.length) return null;

  function goToCategory(categoryId: string) {
    const element = document.getElementById(sectionId(categoryId));
    if (!element) return;

    setActive(categoryId);
    const top = element.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  return (
    <nav className="sticky top-0 z-30 mb-8 border-y border-white/10 bg-[#151515]/95 py-3 backdrop-blur-md">
      <div
        className="flex gap-2 overflow-x-auto px-1 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((category) => {
          const isActive = active === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => goToCategory(category.id)}
              aria-current={isActive ? "location" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "border-white/15 bg-[#202020] text-gray-300 hover:border-orange-400/60 hover:bg-[#292929] hover:text-white"
              }`}
            >
              {category.icon && (
                <span className="mr-2" aria-hidden="true">
                  {category.icon}
                </span>
              )}
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

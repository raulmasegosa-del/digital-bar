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

export default function CategoryNavigation({
  categories,
}: Props) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    categories.forEach((category) => {
      const element = document.getElementById(category.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (!categories.length) return null;

  return (
    <nav className="sticky top-0 z-30 mb-8 border-y border-white/10 bg-[#151515]/95 py-3 backdrop-blur-md">
      <div
        className="flex gap-2 overflow-x-auto px-1 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((category) => {
          const isActive = active === category.id;

          return (
            <a
              key={category.id}
              href={`#${category.id}`}
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
            </a>
          );
        })}
      </div>
    </nav>
  );
}

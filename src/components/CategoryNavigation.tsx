"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data";

export default function CategoryNavigation() {
  const [active, setActive] =
    useState(categories[0]?.id);

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting
            ) {
              setActive(entry.target.id);
            }
          });
        },
        {
          rootMargin:
            "-40% 0px -50% 0px",
          threshold: 0,
        }
      );

    categories.forEach(
      (category) => {
        const element =
          document.getElementById(
            category.id
          );

        if (element) {
          observer.observe(element);
        }
      }
    );

    return () =>
      observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-30 -mx-6 mb-8 border-b border-amber-200 bg-white/90 px-6 py-4 backdrop-blur-md">
      <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map(
          (category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={`
                flex
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                shadow-sm
                transition-all
                duration-200
                ${
                  active ===
                  category.id
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-amber-200 bg-white text-gray-700 hover:bg-amber-100"
                }
              `}
            >
              <span className="text-lg">
                {category.icon}
              </span>

              <span>
                {category.name}
              </span>
            </a>
          )
        )}
      </div>
    </nav>
  );
}
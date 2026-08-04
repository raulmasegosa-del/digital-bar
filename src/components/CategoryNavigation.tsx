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
  const [active, setActive] = useState(
    categories[0]?.id
  );

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
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

    categories.forEach((category) => {
      const element =
        document.getElementById(
          category.id
        );

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav className="sticky top-0 z-30 mb-8 border-b border-amber-200 bg-white/90 py-4 backdrop-blur-md">
      <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              active === category.id
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-amber-200 bg-white hover:bg-amber-100"
            }`}
          >
            {category.icon && (
              <span className="mr-2">
                {category.icon}
              </span>
            )}

            {category.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
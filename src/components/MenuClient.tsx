"use client";

import MenuItemCard from "@/components/MenuItemCard";

type Props = {
  menu: any[];
};

export default function MenuClient({
  menu,
}: Props) {
  return (
    <div className="space-y-12">
      {menu.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="scroll-mt-28"
        >
          <h2 className="mb-5 text-3xl font-bold text-amber-700">
            {category.icon} {category.name}
          </h2>

          <div className="space-y-4">
            {category.items.map((item: any) => (
              <MenuItemCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
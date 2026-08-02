type Props = {
  menu: any[];
};

import MenuItemCard from "@/components/MenuItemCard";

export default function MenuClient({
  menu,
}: Props) {
  return (
    <div className="space-y-10">
      {menu.map((category) => (
        <section key={category.id}>
          <h2 className="mb-4 text-3xl font-bold text-amber-700">
            {category.name}
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
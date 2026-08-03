import MenuItemCard from "@/components/MenuItemCard";
import SectionTitle from "@/components/ui/SectionTitle";

import { MenuCategory, MenuItem } from "@/types/menu";

type Props = {
  category: MenuCategory;
  items: MenuItem[];
};

export default function CategorySection({
  category,
  items,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={category.id}
      className="mb-10 scroll-mt-28"
    >
      <SectionTitle category={category} />

      <div className="space-y-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
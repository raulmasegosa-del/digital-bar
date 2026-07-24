import ProductCard from "@/components/ProductCard";
import { items } from "@/data/menu";
import { MenuCategory } from "@/types/menu";

type Props = {
  category: MenuCategory;
};

export default function CategorySection({ category }: Props) {
  const categoryItems = items.filter(
    (item) => item.categoryId === category.id
  );

  return (
    <section
      id={category.id}
      className="mb-10 scroll-mt-28"
    >
      <h2 className="mb-4 text-2xl font-bold text-amber-800">
        {category.icon} {category.name}
      </h2>

      <div className="space-y-4">
        {categoryItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            />
        ))}
      </div>
    </section>
  );
}
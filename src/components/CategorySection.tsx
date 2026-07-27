import ProductCard from "@/components/ProductCard";
import { items } from "@/data";
import { MenuCategory } from "@/types/menu";
import SectionTitle from "@/components/ui/SectionTitle";
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
      <SectionTitle category={category} />

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
import ProductCard from "@/components/admin/ProductCard";
import { MenuItem } from "@/types/menu";

type Props = {
  items: MenuItem[];
};

export default function FeaturedSection({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-3xl font-bold text-amber-700">
        ⭐ Recomendados de la casa
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
          />
        ))}
      </div>
    </section>
  );
}
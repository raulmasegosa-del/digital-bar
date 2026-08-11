import CategoryCard from "@/components/admin/CategoryCard";

type Category = {
  id: string;
  name: string;
  productCount?: number;
};

type Props = {
  categories: Category[];
  slug: string;
  restaurantId: string;
};

export default function CategoryGrid({
  categories,
  slug,
  restaurantId,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-gray-900">
        <h2 className="text-xl font-semibold">
          Todavía no hay categorías.
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Pulsa en <strong>Nueva categoría</strong> para crear la primera.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          slug={slug}
          restaurantId={restaurantId}
          productCount={category.productCount ?? 0}
        />
      ))}
    </div>
  );
}

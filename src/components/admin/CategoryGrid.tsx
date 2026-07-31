import CategoryCard from "@/components/admin/CategoryCard";
import { getCategories } from "@/lib/db/admin";

type Category = {
  id: string;
  name: string;
};

export default async function CategoryGrid() {
  const categories = (await getCategories()) as Category[];

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow">
        <p className="text-lg font-semibold text-gray-700">
          Todavía no hay categorías.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Pulsa en <strong>Nueva categoría</strong> para crear la primera.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category: Category) => (
        <CategoryCard
          key={category.id}
          item={category}
        />
      ))}
    </div>
  );
}
import Link from "next/link";

import DeleteCategoryButton from "./DeleteCategoryButton";

type Category = {
  id: string;
  name: string;
};

type Props = {
  category: Category;
  slug: string;
  restaurantId: string;
  productCount?: number;
};

export default function CategoryCard({
  category,
  slug,
  restaurantId,
  productCount = 0,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 text-gray-900 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {category.name || "Sin nombre"}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {productCount === 1 ? "1 producto" : `${productCount} productos`}
          </p>
        </div>

        <span className="shrink-0 text-4xl" aria-hidden="true">
          📂
        </span>
      </div>

      <div className="mt-6 flex gap-2">
        <Link
          href={`/admin/${slug}/categories/${category.id}`}
          className="flex-1 rounded-lg bg-amber-600 py-2 text-center text-white transition hover:bg-amber-700"
        >
          Editar
        </Link>

        <DeleteCategoryButton
          id={category.id}
          slug={slug}
          restaurantId={restaurantId}
          name={category.name || "Sin nombre"}
        />
      </div>
    </div>
  );
}

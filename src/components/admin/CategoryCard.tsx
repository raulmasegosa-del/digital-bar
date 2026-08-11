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
};

export default function CategoryCard({
  category,
  slug,
  restaurantId,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {category.name || "Sin nombre"}
          </h3>

          <p className="text-sm text-gray-500">
            ID: {category.id}
          </p>
        </div>

        <span className="text-4xl">📂</span>
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

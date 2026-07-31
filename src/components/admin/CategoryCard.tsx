import Link from "next/link";
import DeleteCategoryButton from "./DeleteCategoryButton";

type Category = {
  id: string;
  name: string;
};

export default function CategoryCard({
  item,
}: {
  item: Category;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            {item.name}
          </h3>

          <p className="text-sm text-gray-500">
            ID: {item.id}
          </p>
        </div>

        <span className="text-4xl">📂</span>
      </div>

      <div className="mt-6 flex gap-2">
        <Link
          href={`/admin/categories/edit/${item.id}`}
          className="flex-1 rounded-lg bg-amber-600 py-2 text-center text-white hover:bg-amber-700"
        >
          Editar
        </Link>

        <DeleteCategoryButton
  id={item.id}
  name={item.name}
/>
      </div>
    </div>
  );
}
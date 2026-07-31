import Link from "next/link";
import CategoryGrid from "@/components/admin/CategoryGrid";

export default function CategoriesPage() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Categorías</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las categorías de tu carta.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700"
        >
          + Nueva categoría
        </Link>
      </div>

      <CategoryGrid />
    </>
  );
}
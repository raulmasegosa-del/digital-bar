import Link from "next/link";
import ProductGrid from "@/components/admin/ProductGrid";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-amber-50 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Panel de administración
            </h1>

            <p className="mt-2 text-gray-600">
              Gestiona todos los productos de tu carta.
            </p>
          </div>

          <Link
            href="/admin/new"
            className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
          >
            + Nuevo producto
          </Link>
        </div>

        <ProductGrid />

      </div>
    </main>
  );
}
import Link from "next/link";

import ProductTable from "@/components/admin/ProductTable";

import { getAdminProducts } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            🍔 Productos
          </h1>

          <p className="mt-2 text-gray-500">
            Gestiona la carta del restaurante.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <ProductTable items={products} />
    </main>
  );
}
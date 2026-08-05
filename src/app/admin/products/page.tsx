import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/form/PrimaryButton";
import ProductTable from "@/components/admin/ProductTable";

import { getAdminProducts } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Productos"
        description="Gestiona la carta del restaurante."
        backHref="/admin"
        backLabel="Dashboard"
      />

      <div className="flex items-center justify-end">
        <Link href="/admin/new">
          <PrimaryButton>
            ➕ Nuevo producto
          </PrimaryButton>
        </Link>
      </div>

      <ProductTable items={products} />
    </main>
  );
}
import Link from "next/link";
import ProductGrid from "@/components/admin/ProductGrid";
import PageHeader from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Productos"
        description="Gestiona los productos de tu carta."
        action={
          <Link
            href="/admin/new"
            className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
          >
            + Nuevo producto
          </Link>
        }
      />

      <ProductGrid />
    </>
  );
}

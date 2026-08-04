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
          <div className="flex gap-3">

            <Link
              href="/admin/orders"
              className="
              rounded-xl
              border
              border-amber-600
              px-6
              py-3
              font-semibold
              text-amber-700
              transition
              hover:bg-amber-50
              "
            >
              📋 Pedidos
            </Link>


            <Link
              href="/admin/new"
              className="
              rounded-xl
              bg-amber-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-amber-700
              "
            >
              + Nuevo producto
            </Link>

          </div>
        }
      />

      <ProductGrid />
    </>
  );
}
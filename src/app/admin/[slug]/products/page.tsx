import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Plus,
  ShoppingBag,
} from "lucide-react";

import ProductTable from "@/components/admin/ProductTable";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getAdminProducts } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductsPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const products = await getAdminProducts(
    restaurant.id
  );

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-[1400px] px-8 py-10 lg:px-12">
        {/* Cabecera */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <ShoppingBag
                  size={19}
                  strokeWidth={1.7}
                />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">
                Carta
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Productos
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Gestiona la carta de {restaurant.name},
              sus precios y disponibilidad.
            </p>
          </div>

          <Link
            href={`/admin/${slug}/products/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100f] transition-all duration-200 hover:bg-amber-400"
          >
            <Plus size={17} strokeWidth={2} />
            Nuevo producto
          </Link>
        </div>

        {/* Separador */}
        <div className="mb-8 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

        {/* Tabla */}
        <ProductTable
          items={products}
          slug={slug}
        />
      </div>
    </main>
  );
}
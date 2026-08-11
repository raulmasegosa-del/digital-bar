import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import {
  getCategories,
  getOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewProductPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const [
    categories,
    optionGroups,
  ] = await Promise.all([
    getCategories(restaurant.id),
    getOptionGroups(restaurant.id),
  ]);

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="w-full px-6 py-8">
        {/* Cabecera */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">
            Carta
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Nuevo producto
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Añade un producto a la carta de{" "}
            {restaurant.name}.
          </p>
        </div>

        {/* Separador */}
        <div className="mb-8 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

        {/* Formulario */}
        <ProductForm
          restaurantId={restaurant.id}
          slug={slug}
          categories={categories}
          optionGroups={optionGroups}
        />
      </div>
    </main>
  );
}
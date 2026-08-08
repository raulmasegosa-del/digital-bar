import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { getRestaurants } from "@/lib/db/restaurants/getRestaurants";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <>
      <PageHeader
        title="Restaurantes"
        description="Gestiona los restaurantes de Digital Bar Platform."
      />

      <div className="mb-8 flex justify-end">
        <Link
          href="/super/restaurants/new"
          className="rounded-xl bg-amber-600 px-5 py-3 font-medium text-white transition hover:bg-amber-700"
        >
          ➕ Nuevo restaurante
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">
            No hay restaurantes
          </h2>

          <p className="mt-2 text-gray-500">
            Crea el primero para comenzar.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/super/restaurants/${restaurant.slug}`}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {restaurant.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {restaurant.slug}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    restaurant.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {restaurant.active
                    ? "Activo"
                    : "Inactivo"}
                </span>
              </div>

              <div className="mt-6 border-t pt-4">
                <span className="font-medium text-amber-600">
                  Abrir restaurante →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
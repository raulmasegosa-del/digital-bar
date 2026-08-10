import Link from "next/link";

import PrimaryButton from "@/components/ui/form/PrimaryButton";

import { getRestaurants } from "@/lib/db/restaurants/getRestaurants";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <>
      <div className="mb-8 flex justify-end">
        <Link href="/super/restaurants/new">
          <PrimaryButton>
            ➕ Nuevo restaurante
          </PrimaryButton>
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
            <div
              key={restaurant.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
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

              <div className="mt-6 flex flex-col gap-3 border-t pt-4">
                {/* Acción principal */}
                <Link href={`/r/${restaurant.slug}`}>
                  <PrimaryButton className="w-full">
                    🍻 Abrir Restaurante
                  </PrimaryButton>
                </Link>

                {/* Acciones secundarias */}
                <Link href={`/admin/${restaurant.slug}`}>
                  <span
                    className="
                      flex w-full items-center justify-center
                      rounded-xl
                      border border-gray-300
                      bg-white
                      px-5 py-2.5
                      text-sm font-semibold text-gray-800
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-amber-500
                      hover:bg-amber-50
                      hover:text-amber-700
                      hover:shadow-sm
                    "
                  >
                    🛠 Administrar
                  </span>
                </Link>

                <Link
                  href={`/super/restaurants/${restaurant.slug}/import`}
                >
                  <span
                    className="
                      flex w-full items-center justify-center
                      rounded-xl
                      border border-gray-300
                      bg-white
                      px-5 py-2.5
                      text-sm font-semibold text-gray-800
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-amber-500
                      hover:bg-amber-50
                      hover:text-amber-700
                      hover:shadow-sm
                    "
                  >
                    📥 Importar Excel
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
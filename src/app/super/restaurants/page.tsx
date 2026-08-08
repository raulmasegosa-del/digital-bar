import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/form/PrimaryButton";

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

              <div className="mt-6 grid gap-3 border-t pt-4">
                <Link href={`/admin/${restaurant.slug}`}>
                  <PrimaryButton className="w-full">
                    🛠 Administrar
                  </PrimaryButton>
                </Link>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border bg-gray-50 px-4 py-2 text-gray-400"
                  title="Disponible cuando la carta pública esté implementada"
                >
                  👁 Ver carta
                </button>

                {restaurant.website ? (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border px-4 py-2 text-center transition hover:bg-gray-50"
                  >
                    🌐 Abrir web
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border bg-gray-50 px-4 py-2 text-gray-400"
                    title="Este restaurante todavía no tiene una web configurada"
                  >
                    🌐 Abrir web
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
import Link from "next/link";

import { getRestaurants } from "@/lib/db/restaurants";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            🍽 Restaurantes
          </h1>

          <p className="mt-2 text-gray-500">
            Gestiona todos los restaurantes de la plataforma.
          </p>
        </div>

        <Link
          href="/super/restaurants/new"
          className="rounded-xl bg-amber-600 px-5 py-3 font-medium text-white transition hover:bg-amber-700"
        >
          + Nuevo restaurante
        </Link>
      </div>

      <div className="space-y-4">
        {restaurants.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
            No hay restaurantes creados.
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {restaurant.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {restaurant.slug}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    restaurant.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {restaurant.active
                    ? "🟢 Activo"
                    : "⚪ Inactivo"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                  ⚙ Configurar
                </button>

                <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                  📥 Inicializar carta
                </button>

                <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                  👨‍💼 Abrir Admin
                </button>

                <button className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                  🌐 Ver carta
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
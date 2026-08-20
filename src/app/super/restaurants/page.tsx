import Link from "next/link";
import { Plus, Store } from "lucide-react";

import { getRestaurants } from "@/lib/db/restaurants/getRestaurants";
import RestaurantSearch from "@/components/super/RestaurantSearch";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();
  const activeCount = restaurants.filter((restaurant) => restaurant.active).length;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Store size={18} strokeWidth={1.7} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Plataforma</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Restaurantes</h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona los restaurantes y accede rápidamente a su operativa.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Total</p>
            <p className="mt-0.5 text-lg font-semibold text-white">{restaurants.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Activos</p>
            <p className="mt-0.5 text-lg font-semibold text-white">{activeCount}</p>
          </div>
          <Link href="/super/restaurants/new" className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 transition hover:border-amber-400/50 hover:bg-amber-500/15">
            <Plus size={16} /> Nuevo
          </Link>
        </div>
      </header>

      <div className="mb-6 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

      {restaurants.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-16 text-center">
          <Store className="mx-auto h-10 w-10 text-zinc-700" />
          <h2 className="mt-5 text-lg font-semibold text-white">No hay restaurantes todavía</h2>
          <p className="mt-2 text-sm text-zinc-500">Crea el primero para comenzar a gestionar la plataforma.</p>
          <Link href="/super/restaurants/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500">
            <Plus size={16} /> Crear restaurante
          </Link>
        </div>
      ) : (
        <RestaurantSearch restaurants={restaurants} />
      )}
    </div>
  );
}

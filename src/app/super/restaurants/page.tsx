import Link from "next/link";
import { Plus, Store, ExternalLink, Settings, FileSpreadsheet } from "lucide-react";

import { getRestaurants } from "@/lib/db/restaurants/getRestaurants";

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
          <Link
            href="/super/restaurants/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 transition hover:border-amber-400/50 hover:bg-amber-500/15"
          >
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
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <article key={restaurant.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716] shadow-[0_10px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/20 transition hover:border-zinc-700">
              <div className="border-b border-zinc-800 bg-[#1d1b19] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${restaurant.active ? "bg-emerald-400" : "bg-zinc-600"}`} />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Restaurante</span>
                    </div>
                    <h2 className="mt-2 truncate text-xl font-bold text-white">{restaurant.name}</h2>
                    <p className="mt-1 truncate text-xs text-zinc-500">/{restaurant.slug}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${restaurant.active ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800 text-zinc-400"}`}>
                    {restaurant.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid gap-2.5">
                  <Link href={`/admin/${restaurant.slug}/orders`} className="flex min-h-11 items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 text-sm font-semibold text-amber-200 transition hover:border-amber-400/50 hover:bg-amber-500/15">
                    <span className="flex items-center gap-2"><Store size={16} /> Abrir Pedidos</span>
                    <ExternalLink size={15} />
                  </Link>
                  <Link href={`/admin/${restaurant.slug}`} className="flex min-h-11 items-center justify-between rounded-xl border border-zinc-700 bg-[#141311] px-4 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900">
                    <span className="flex items-center gap-2"><Settings size={16} /> Administrar</span>
                    <ExternalLink size={15} />
                  </Link>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Link href={`/r/${restaurant.slug}`} className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#141311] px-3 text-xs font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white">
                      <ExternalLink size={14} /> Ver carta
                    </Link>
                    <Link href={`/super/restaurants/${restaurant.slug}/import`} className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#141311] px-3 text-xs font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white">
                      <FileSpreadsheet size={14} /> Importar Excel
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

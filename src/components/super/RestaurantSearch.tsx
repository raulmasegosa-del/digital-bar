"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileSpreadsheet, Search, Settings, Store } from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export default function RestaurantSearch({ restaurants }: { restaurants: Restaurant[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = useMemo(
    () => restaurants.filter((restaurant) => `${restaurant.name} ${restaurant.slug}`.toLocaleLowerCase().includes(normalizedQuery)),
    [restaurants, normalizedQuery]
  );

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#181716] p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar restaurante..."
            aria-label="Buscar restaurante"
            className="min-h-11 w-full rounded-xl border border-zinc-700 bg-[#11100f] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20"
          />
        </div>
        <p className="shrink-0 text-xs text-zinc-500">
          {filtered.length} de {restaurants.length} restaurantes
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-14 text-center">
          <Search className="mx-auto h-9 w-9 text-zinc-700" />
          <h2 className="mt-4 text-lg font-semibold text-white">No se encontraron restaurantes</h2>
          <p className="mt-2 text-sm text-zinc-500">Prueba con otro nombre o slug.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((restaurant) => (
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
    </>
  );
}

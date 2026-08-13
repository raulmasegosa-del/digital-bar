import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ClipboardList,
  Settings,
  ShoppingBag,
  Table2,
} from "lucide-react";

import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminDashboardPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const superAdmin = await isSuperAdmin(user.id);

  if (!superAdmin) {
    const { data: membership, error: membershipError } = await supabase
      .from("restaurant_users")
      .select("restaurant_id, role")
      .eq("user_id", user.id)
      .eq("restaurant_id", restaurant.id)
      .in("role", ["owner", "staff"])
      .maybeSingle();

    if (membershipError) throw membershipError;
    if (!membership) notFound();
  }

  const base = `/admin/${restaurant.slug}`;

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-[1400px] px-8 py-10 lg:px-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {restaurant.name}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Tu restaurante, todo bajo control.
          </p>
        </div>

        <Link
          href={`${base}/products`}
          className="group mb-5 block rounded-2xl border border-zinc-800 bg-[#181716] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-[#1c1a18] hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)]"
        >
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <div className="mb-8 flex items-start justify-between md:justify-start md:gap-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition group-hover:border-amber-500/40 group-hover:bg-amber-500/15">
                  <ShoppingBag size={21} strokeWidth={1.7} />
                </div>
                <span className="pt-1 text-[10px] font-medium tracking-[0.2em] text-zinc-600">01</span>
              </div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Carta</p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Productos</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Gestiona los productos, precios y categorías de la carta de tu restaurante.</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-amber-500 transition-all group-hover:gap-3 group-hover:text-amber-400">Gestionar <span aria-hidden="true">→</span></div>
          </div>
        </Link>

        <div className="grid gap-5 md:grid-cols-2">
          <Link href={`${base}/orders`} className="group block rounded-2xl border border-zinc-800 bg-[#181716] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-[#1c1a18]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/5 text-amber-400 transition group-hover:border-amber-500/30 group-hover:bg-amber-500/10"><ClipboardList size={20} strokeWidth={1.7} /></div>
              <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">02</span>
            </div>
            <div className="mt-8"><h2 className="text-lg font-semibold text-white">Pedidos</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">Consulta y controla los pedidos en tiempo real.</p></div>
            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-amber-500 transition-all group-hover:gap-3 group-hover:text-amber-400">Ver pedidos <span aria-hidden="true">→</span></div>
          </Link>

          <Link href={`${base}/tables`} className="group block rounded-2xl border border-zinc-800 bg-[#181716] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-[#1c1a18]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/5 text-amber-400 transition group-hover:border-amber-500/30 group-hover:bg-amber-500/10"><Table2 size={20} strokeWidth={1.7} /></div>
              <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">03</span>
            </div>
            <div className="mt-8"><h2 className="text-lg font-semibold text-white">Mesas</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">Gestiona las mesas y la operativa del restaurante.</p></div>
            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-amber-500 transition-all group-hover:gap-3 group-hover:text-amber-400">Gestionar <span aria-hidden="true">→</span></div>
          </Link>
        </div>

        <Link href={`${base}/settings`} className="group mt-5 block rounded-2xl border border-zinc-800 bg-[#151413] px-7 py-6 transition-all duration-200 hover:border-amber-500/25 hover:bg-[#191817]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition group-hover:border-amber-500/20 group-hover:text-amber-400"><Settings size={18} strokeWidth={1.7} /></div>
              <div>
                <div className="flex items-center gap-3"><h2 className="text-base font-semibold text-white">Configuración</h2><span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">04</span></div>
                <p className="mt-1 text-sm text-zinc-500">Personaliza la apariencia y configuración del restaurante.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-amber-500 transition-all group-hover:gap-3 group-hover:text-amber-400">Configurar <span aria-hidden="true">→</span></div>
          </div>
        </Link>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-800 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{restaurant.slug}</span>
          <span>Digital Bar · Panel de administración</span>
        </div>
      </div>
    </main>
  );
}

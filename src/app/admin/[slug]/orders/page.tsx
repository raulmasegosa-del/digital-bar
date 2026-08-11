import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import RestaurantOrderActions from "@/components/admin/RestaurantOrderActions";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantOrders } from "@/lib/db/restaurants/orders/getRestaurantOrders";
import type { Order, OrderStatus } from "@/types/orders";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const statusLabels: Record<OrderStatus, string> = {
  pending: "Recibido",
  preparing: "Preparando",
  ready: "Listo",
  served: "Servido",
  bill: "Cuenta",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  preparing: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  ready: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  served: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  bill: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  completed: "border-zinc-700 bg-zinc-800 text-zinc-300",
  cancelled: "border-red-500/20 bg-red-500/10 text-red-400",
};

type OrderSection = {
  key: string;
  title: string;
  description: string;
  orders: Order[];
  accent: string;
  dot: string;
};

function sortByCreatedAt(orders: Order[]) {
  return [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export default async function OrdersPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  const orders = await getRestaurantOrders(restaurant.id);
  const received = orders.filter((order) => order.status === "pending");
  const preparing = orders.filter((order) => order.status === "preparing" || order.status === "ready");
  const served = orders.filter((order) => order.status === "served" || order.status === "bill");
  const historical = orders.filter((order) => order.status === "completed" || order.status === "cancelled");

  const sections: OrderSection[] = [
    { key: "received", title: "Recibido", description: "Pedidos nuevos", orders: sortByCreatedAt(received), accent: "border-yellow-500/30 bg-yellow-500/[0.035]", dot: "bg-yellow-400" },
    { key: "preparing", title: "Preparando", description: "En cocina o listos", orders: sortByCreatedAt(preparing), accent: "border-blue-500/30 bg-blue-500/[0.035]", dot: "bg-blue-400" },
    { key: "served", title: "Servido", description: "Entregados o pendientes de cierre", orders: sortByCreatedAt(served), accent: "border-emerald-500/30 bg-emerald-500/[0.035]", dot: "bg-emerald-400" },
  ];

  const activeCount = received.length + preparing.length + served.length;

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400"><ClipboardList size={18} strokeWidth={1.7} /></div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Operativa</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pedidos</h1>
            <p className="mt-2 text-sm text-zinc-400">{restaurant.name} · control visual de la sala</p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5"><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Activos</p><p className="mt-0.5 text-lg font-semibold text-white">{activeCount}</p></div>
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5"><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Histórico</p><p className="mt-0.5 text-lg font-semibold text-white">{historical.length}</p></div>
          </div>
        </header>

        <div className="mb-6 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-zinc-700" />
            <h2 className="mt-5 text-lg font-semibold text-white">No hay pedidos todavía</h2>
            <p className="mt-2 text-sm text-zinc-500">Cuando un cliente haga un pedido aparecerá aquí.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
              {sections.map((section) => (
                <section key={section.key} className={`min-w-0 rounded-2xl border p-3 sm:p-4 ${section.accent}`}>
                  <div className="sticky top-2 z-10 mb-4 rounded-xl border border-zinc-800 bg-[#151413]/95 px-4 py-3 shadow-lg backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${section.dot}`} />
                        <div className="min-w-0"><h2 className="text-lg font-semibold text-white">{section.title}</h2><p className="truncate text-[11px] text-zinc-500">{section.description}</p></div>
                      </div>
                      <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-[#11100f] px-2 text-xs font-bold text-zinc-200">{section.orders.length}</span>
                    </div>
                  </div>

                  {section.orders.length === 0 ? (
                    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#141311]/70 px-5 py-8 text-center text-sm text-zinc-600">No hay pedidos</div>
                  ) : (
                    <div className="space-y-3">{section.orders.map((order) => <OrderCard key={order.id} order={order} slug={slug} restaurantName={restaurant.name} />)}</div>
                  )}
                </section>
              ))}
            </div>

            {historical.length > 0 && (
              <section className="mt-8 rounded-2xl border border-zinc-800 bg-[#151413] p-4 sm:p-5">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
                  <div><h2 className="text-lg font-semibold text-zinc-300">Histórico</h2><p className="mt-1 text-xs text-zinc-600">Pedidos finalizados o cancelados</p></div>
                  <span className="rounded-full border border-zinc-800 bg-[#181716] px-3 py-1 text-xs text-zinc-500">{historical.length}</span>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">{sortByCreatedAt(historical).reverse().map((order) => <OrderCard key={order.id} order={order} slug={slug} restaurantName={restaurant.name} compact />)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function OrderCard({ order, slug, restaurantName, compact = false }: { order: Order; slug: string; restaurantName: string; compact?: boolean }) {
  const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-700/80 bg-[#181716] shadow-[0_10px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/20">
      <div className="border-b border-zinc-800 bg-[#1d1b19] px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 min-w-[88px] items-center justify-center gap-1.5 rounded-xl border-2 border-amber-500/40 bg-amber-500/[0.08] px-3 shadow-inner shadow-amber-500/5"><span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500">Mesa</span><span className="text-2xl font-black leading-none tracking-tight text-white">{order.table_number}</span></div>
            <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Pedido</p><p className="mt-0.5 truncate text-xs text-zinc-500">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString("es-ES")}</p></div>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[order.status]}`}>{statusLabels[order.status]}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">Artículos</p><p className="mt-1 text-sm font-medium text-zinc-300">{itemCount}</p></div>
          <div className="text-left sm:text-right"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">Total</p><p className="mt-0.5 text-2xl font-bold tracking-tight text-white">{order.total.toFixed(2)} €</p></div>
        </div>

        {!compact && (
          <>
            <div className="my-4 h-px bg-zinc-800" />
            <div className="grid gap-2.5 sm:grid-cols-2">{order.order_items.map((item) => <div key={item.id} className="rounded-lg border border-zinc-800/80 bg-[#141311] px-3.5 py-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-medium text-zinc-200">{item.quantity} × {item.name}</p>{item.options.length > 0 && <p className="mt-1 text-xs leading-5 text-zinc-500">{item.options.map((option) => option.optionName).join(" · ")}</p>}</div><span className="shrink-0 text-xs text-zinc-400">{(item.price * item.quantity).toFixed(2)} €</span></div></div>)}</div>
            {order.notes && <div className="mt-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-3.5 py-2.5"><p className="text-[10px] font-medium uppercase tracking-wider text-amber-500">Nota</p><p className="mt-1 text-sm text-zinc-300">{order.notes}</p></div>}
          </>
        )}

        <div className="mt-4 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] text-zinc-600">Pedido de {restaurantName}</p><RestaurantOrderActions slug={slug} orderId={order.id} status={order.status} /></div>
      </div>
    </article>
  );
}

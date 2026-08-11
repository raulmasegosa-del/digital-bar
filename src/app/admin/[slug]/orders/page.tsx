import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import RestaurantOrderActions from "@/components/admin/RestaurantOrderActions";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantOrders } from "@/lib/db/restaurants/orders/getRestaurantOrders";
import type { Order, OrderStatus } from "@/types/orders";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

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
};

function sortByCreatedAt(orders: Order[]) {
  return [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export default async function OrdersPage({ params }: Props) {
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

  const orders = await getRestaurantOrders(restaurant.id);

  const received = orders.filter((order) => order.status === "pending");
  const preparing = orders.filter(
    (order) => order.status === "preparing" || order.status === "ready"
  );
  const served = orders.filter(
    (order) => order.status === "served" || order.status === "bill"
  );
  const historical = orders.filter(
    (order) => order.status === "completed" || order.status === "cancelled"
  );

  const sections: OrderSection[] = [
    {
      key: "received",
      title: "Recibido",
      description: "Pedidos nuevos pendientes de preparación",
      orders: sortByCreatedAt(received),
      accent: "border-yellow-500/25 bg-yellow-500/[0.04]",
    },
    {
      key: "preparing",
      title: "Preparando",
      description: "Pedidos en cocina o listos para servir",
      orders: sortByCreatedAt(preparing),
      accent: "border-blue-500/25 bg-blue-500/[0.04]",
    },
    {
      key: "served",
      title: "Servido",
      description: "Pedidos entregados o pendientes de cerrar",
      orders: sortByCreatedAt(served),
      accent: "border-emerald-500/25 bg-emerald-500/[0.04]",
    },
  ];

  const activeCount = received.length + preparing.length + served.length;

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <ClipboardList size={18} strokeWidth={1.7} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">
                Operativa
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pedidos</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {restaurant.name} · seguimiento por estado
            </p>
          </div>

          <div className="flex gap-2">
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Activos</p>
              <p className="mt-0.5 text-lg font-semibold text-white">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-2.5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Histórico</p>
              <p className="mt-0.5 text-lg font-semibold text-white">{historical.length}</p>
            </div>
          </div>
        </header>

        <div className="mb-8 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-zinc-700" />
            <h2 className="mt-5 text-lg font-semibold text-white">No hay pedidos todavía</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Cuando un cliente haga un pedido aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.key} className={`rounded-2xl border p-4 sm:p-5 ${section.accent}`}>
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    <p className="mt-1 text-xs text-zinc-500">{section.description}</p>
                  </div>
                  <span className="rounded-full border border-zinc-700 bg-[#181716] px-3 py-1 text-xs font-semibold text-zinc-300">
                    {section.orders.length}
                  </span>
                </div>

                {section.orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-800 bg-[#141311]/70 px-5 py-8 text-center text-sm text-zinc-600">
                    No hay pedidos en este estado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.orders.map((order) => (
                      <OrderCard key={order.id} order={order} slug={slug} restaurantName={restaurant.name} />
                    ))}
                  </div>
                )}
              </section>
            ))}

            {historical.length > 0 && (
              <section className="rounded-2xl border border-zinc-800 bg-[#151413] p-4 sm:p-5">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-300">Histórico</h2>
                    <p className="mt-1 text-xs text-zinc-600">Pedidos finalizados o cancelados</p>
                  </div>
                  <span className="rounded-full border border-zinc-800 bg-[#181716] px-3 py-1 text-xs text-zinc-500">
                    {historical.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {sortByCreatedAt(historical).reverse().map((order) => (
                    <OrderCard key={order.id} order={order} slug={slug} restaurantName={restaurant.name} compact />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function OrderCard({
  order,
  slug,
  restaurantName,
  compact = false,
}: {
  order: Order;
  slug: string;
  restaurantName: string;
  compact?: boolean;
}) {
  const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="rounded-xl border border-zinc-800 bg-[#181716] p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-semibold text-white">Mesa {order.table_number}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[order.status]}`}>
              {statusLabels[order.status]}
            </span>
            <span className="text-[11px] text-zinc-600">#{order.id.slice(0, 8)}</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            {new Date(order.created_at).toLocaleString("es-ES")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-5 sm:justify-start">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">Artículos</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-300">{itemCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-white">{order.total.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="my-4 h-px bg-zinc-800" />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="rounded-lg border border-zinc-800/80 bg-[#141311] px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200">
                      {item.quantity} × {item.name}
                    </p>
                    {item.options.length > 0 && (
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {item.options.map((option) => option.optionName).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="mt-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-3.5 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500">Nota</p>
              <p className="mt-1 text-sm text-zinc-300">{order.notes}</p>
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-zinc-600">
          Pedido de {restaurantName}
        </p>
        <RestaurantOrderActions slug={slug} orderId={order.id} status={order.status} />
      </div>
    </article>
  );
}

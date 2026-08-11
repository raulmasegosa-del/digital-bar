import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import RestaurantOrderActions from "@/components/admin/RestaurantOrderActions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantOrders } from "@/lib/db/restaurants/orders/getRestaurantOrders";
import type { OrderStatus } from "@/types/orders";

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

export default async function OrdersPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_users")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membership) notFound();

  const restaurant = await getRestaurant(slug);

  if (!restaurant || restaurant.id !== membership.restaurant_id) {
    notFound();
  }

  const orders = await getRestaurantOrders(restaurant.id);

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "completed" &&
      order.status !== "cancelled"
  );

  const completedOrders = orders.filter(
    (order) =>
      order.status === "completed" ||
      order.status === "cancelled"
  );

  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="mx-auto max-w-[1400px] px-8 py-10 lg:px-12">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <ClipboardList size={19} strokeWidth={1.7} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">
                Operativa
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Pedidos
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Consulta y controla los pedidos de {restaurant.name}.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Activos</p>
              <p className="mt-1 text-xl font-semibold text-white">{activeOrders.length}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#181716] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Histórico</p>
              <p className="mt-1 text-xl font-semibold text-white">{completedOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 h-px bg-gradient-to-r from-amber-500/40 via-zinc-800 to-transparent" />

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-zinc-700" />
            <h2 className="mt-5 text-lg font-semibold text-white">
              No hay pedidos todavía
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Cuando un cliente haga un pedido aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-zinc-800 bg-[#181716] p-6 transition hover:border-zinc-700"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">
                        Mesa {order.table_number}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(order.created_at).toLocaleString("es-ES")}
                      <span className="mx-2 text-zinc-700">·</span>
                      #{order.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-semibold text-white">
                      {order.total.toFixed(2)} €
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} artículos
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-zinc-800" />

                <div className="grid gap-3 md:grid-cols-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-zinc-800/80 bg-[#141311] px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-zinc-200">
                            {item.quantity} × {item.name}
                          </p>
                          {item.options.length > 0 && (
                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                              {item.options.map((option) => option.optionName).join(" · ")}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm text-zinc-400">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-500">
                      Nota
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">{order.notes}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-zinc-600">
                    El pedido pertenece exclusivamente a {restaurant.name}.
                  </p>
                  <RestaurantOrderActions
                    slug={slug}
                    orderId={order.id}
                    status={order.status}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

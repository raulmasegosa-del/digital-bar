import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RestaurantOrderActions from "@/components/admin/RestaurantOrderActions";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantOrders } from "@/lib/db/restaurants/orders/getRestaurantOrders";
import type { OrderStatus } from "@/types/orders";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; table: string }> };

const statusLabels: Record<OrderStatus, string> = {
  pending: "Recibido",
  preparing: "Preparando",
  ready: "Listo",
  served: "Servido",
  bill: "Cuenta",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

export default async function WaiterTablePage({ params }: Props) {
  const { slug, table } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/waiter/${slug}/login`);

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("restaurant_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("restaurant_id", restaurant.id)
    .in("role", ["owner", "staff"])
    .maybeSingle();
  if (membershipError) throw membershipError;
  if (!membership) redirect(`/waiter/${slug}/login`);

  const tableNumber = String(Number(table));
  const orders = (await getRestaurantOrders(restaurant.id)).filter((order) => order.table_number === tableNumber);
  const activeOrders = orders.filter((order) => !["completed", "cancelled"].includes(order.status));
  const total = activeOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const ids = activeOrders.map((order) => order.id);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Modo camarero · {restaurant.name}</p>
            <h1 className="text-4xl font-black text-slate-900">Mesa {tableNumber}</h1>
          </div>
          <Link href={`/waiter/${slug}`} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">← Mesas</Link>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Pedidos activos</p><p className="mt-1 text-3xl font-black text-slate-900">{activeOrders.length}</p></div>
          <div className="rounded-2xl bg-white p-4 text-right shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Total mesa</p><p className="mt-1 text-3xl font-black text-slate-900">{total.toFixed(2)} €</p></div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-800">Mesa libre</p>
            <p className="mt-2 text-sm text-slate-500">Todavía no hay pedidos activos en esta mesa.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pedido #{order.id.slice(0, 8)}</p>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{statusLabels[order.status]}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{order.total.toFixed(2)} €</p>
                </div>
                <div className="mt-4 space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                      <span className="font-medium text-slate-800">{item.quantity} × {item.name}</span>
                      <span className="text-sm text-slate-600">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                {order.notes && <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900"><strong>Nota:</strong> {order.notes}</div>}
                <div className="mt-4 border-t pt-4">
                  <RestaurantOrderActions slug={slug} orderId={order.id} status={order.status} total={order.total} tableOrderIds={ids} tableTotal={total} />
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-dashed bg-white p-5 text-center shadow-sm">
          <p className="font-bold text-slate-800">Tomar pedido desde esta mesa</p>
          <p className="mt-1 text-sm text-slate-500">La pantalla de carta para camareros será el siguiente bloque: buscador, fotos y añadir productos directamente a esta mesa.</p>
        </div>
      </div>
    </main>
  );
}

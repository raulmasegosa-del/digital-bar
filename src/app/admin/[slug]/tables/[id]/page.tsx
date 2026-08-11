import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import AddTableItems from "@/components/admin/tables/AddTableItems";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";
import { getTableActiveOrders } from "@/lib/db/restaurants/tables/getTableActiveOrders";
import { getRestaurantMenu } from "@/lib/db/restaurants/menu/getRestaurantMenu";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; id: string }> };
type MenuPrice = { price: number | string; active?: boolean };
type MenuItem = { id: string; name: string; prices: MenuPrice[] };
type MenuCategory = { id: string; name: string; items: MenuItem[] };

const statusLabels: Record<string, string> = { pending: "Nuevo", preparing: "Preparando", ready: "Listo", served: "Servido", bill: "Cuenta solicitada" };

export default async function TableDetailPage({ params }: Props) {
  const { slug, id } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();
  const tables = await getRestaurantTables(restaurant.id);
  const table = tables.find((item) => item.id === id);
  if (!table) notFound();
  const [orders, rawMenu] = await Promise.all([getTableActiveOrders(restaurant.id, table.number), getRestaurantMenu(restaurant.id)]);
  const menu = rawMenu as MenuCategory[];
  const total = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);

  return (
    <main className="space-y-8">
      <PageHeader title={table.name || `Mesa ${table.number}`} description={`${restaurant.name} · ${table.zone || "Sin zona"}`} />
      <Link href={`/admin/${slug}/tables`} className="inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800">← Volver a mesas</Link>
      <section className="rounded-2xl border border-zinc-800 bg-[#181716] p-6">
        <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-zinc-500">Mesa {table.number}</p><h2 className="mt-1 text-xl font-semibold text-white">Lo servido / pendiente</h2></div><div className="text-left sm:text-right"><p className="text-xs uppercase tracking-wide text-zinc-500">Total abierto</p><p className="mt-1 text-2xl font-semibold text-amber-500">{total.toFixed(2)} €</p></div></div>
        {orders.length === 0 ? <div className="py-10 text-center"><p className="text-base font-medium text-white">No hay pedidos abiertos</p><p className="mt-2 text-sm text-zinc-500">Puedes añadir una consumición directamente desde aquí.</p></div> : <div className="mt-6 space-y-6">{orders.map((order, index) => <article key={order.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-white">Pedido {index + 1}</p><p className="mt-1 text-xs text-zinc-500">{new Date(order.created_at ?? Date.now()).toLocaleString("es-ES")}</p></div><span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">{statusLabels[order.status ?? ""] || order.status || "Pendiente"}</span></div><div className="mt-4 divide-y divide-zinc-800">{order.order_items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="font-medium text-white">{item.quantity} × {item.name}</p>{Array.isArray(item.options) && item.options.length > 0 && <p className="mt-1 text-xs text-zinc-500">Con opciones seleccionadas</p>}</div><p className="shrink-0 text-sm text-zinc-300">{(Number(item.price) * item.quantity).toFixed(2)} €</p></div>)}</div>{order.notes && <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-400">Nota: {order.notes}</div>}<div className="mt-4 flex justify-end border-t border-zinc-800 pt-4 text-sm font-semibold text-white">Pedido: {Number(order.total ?? 0).toFixed(2)} €</div></article>)}</div>}
      </section>
      <AddTableItems slug={slug} restaurantId={restaurant.id} tableId={table.id} categories={menu.map((category) => ({ id: category.id, name: category.name, items: category.items.map((item) => ({ id: item.id, name: item.name, prices: item.prices })) }))} />
    </main>
  );
}

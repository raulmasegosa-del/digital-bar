"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getCustomerOrders, cancelCustomerOrder } from "@/app/actions/customerOrders";
import { useTable } from "@/context/TableContext";

type Props = { restaurantId: string; onBack: () => void };
type Order = { id: string; status: string; total: number; created_at: string; items: Array<{ id: string; name: string; quantity: number; price: number; options: Array<{ optionName?: string; extraPrice?: number }> }> };

const groups = [
  { key: "pending", title: "Recibidos", icon: "🟡" },
  { key: "preparing", title: "Preparando", icon: "👨‍🍳" },
  { key: "ready", title: "Listos", icon: "🍽️" },
  { key: "served", title: "Servidos", icon: "✅" },
  { key: "bill", title: "Pendientes de cobro", icon: "💰" },
] as const;

export default function CustomerOrderHistory({ restaurantId, onBack }: Props) {
  const { table, sessionToken } = useTable();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function load() {
    if (!table || !sessionToken) { setError("No se ha podido identificar la sesión de la mesa."); setLoading(false); return; }
    try { setLoading(true); setError(""); setOrders(await getCustomerOrders(restaurantId, table, sessionToken)); }
    catch (err) { setError(err instanceof Error ? err.message : "No se han podido cargar tus pedidos."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [restaurantId, table, sessionToken]);

  async function cancel(id: string) {
    if (!table || !sessionToken || !confirm("¿Seguro que quieres cancelar este pedido?")) return;
    try {
      setCancelling(id);
      await cancelCustomerOrder(restaurantId, table, sessionToken, id);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "No se ha podido cancelar el pedido."); }
    finally { setCancelling(null); }
  }

  const absoluteTotal = useMemo(() => orders.reduce((sum, order) => sum + (order.status === "cancelled" ? 0 : Number(order.total)), 0), [orders]);

  return <div className="fixed inset-0 z-[70] flex h-screen flex-col bg-[#111110] text-white">
    <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-[#181716] p-5">
      <button type="button" onClick={onBack} aria-label="Volver al carrito" className="rounded-xl border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800"><ArrowLeft size={20} /></button>
      <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-500">Digital Bar</p><h2 className="mt-1 text-2xl font-bold">Mis Pedidos</h2></div>
    </header>
    <main className="flex-1 overflow-y-auto p-5">
      {loading ? <p className="py-12 text-center text-zinc-500">Cargando tus pedidos…</p> : error ? <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">{error}</div> : orders.length === 0 ? <div className="py-16 text-center"><ClipboardList size={42} className="mx-auto text-zinc-700" /><p className="mt-4 text-zinc-400">Todavía no tienes pedidos en esta sesión.</p></div> : <div className="space-y-8">
        {groups.map((group) => {
          const groupOrders = orders.filter((order) => order.status === group.key);
          if (!groupOrders.length) return null;
          return <section key={group.key}><h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-300"><span>{group.icon}</span>{group.title}</h3><div className="space-y-3">{groupOrders.map((order) => <article key={order.id} className="rounded-2xl border border-zinc-800 bg-[#181716] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-zinc-500">Pedido · {new Date(order.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p><div className="mt-3 space-y-2">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="text-zinc-200">{item.quantity} × {item.name}</span><span className="shrink-0 text-zinc-400">{(Number(item.price) * Number(item.quantity)).toFixed(2)} €</span></div>)}</div></div><span className="shrink-0 text-lg font-extrabold text-amber-500">{Number(order.total).toFixed(2)} €</span></div>{order.status === "pending" && <button type="button" disabled={cancelling === order.id} onClick={() => void cancel(order.id)} className="mt-4 w-full rounded-xl border border-red-500/30 bg-red-500/5 py-3 text-sm font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50">{cancelling === order.id ? "Cancelando…" : "Cancelar pedido"}</button>}</article>)}</div></section>;
        })}
      </div>}
    </main>
    <footer className="shrink-0 border-t border-zinc-800 bg-[#181716] p-5"><div className="mb-4 flex items-center justify-between"><span className="text-lg font-bold">Total absoluto</span><span className="text-3xl font-black text-amber-500">{absoluteTotal.toFixed(2)} €</span></div><button type="button" onClick={onBack} className="w-full rounded-xl bg-amber-500 py-3 font-bold text-black hover:bg-amber-400">← Volver al carrito</button></footer>
  </div>;
}

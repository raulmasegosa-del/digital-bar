"use client";

import { Trash2, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { useOrder } from "@/context/OrderContext";
import { createOrder } from "@/lib/orders/createOrder";

type Props = { open: boolean; onClose: () => void; restaurantId: string };

export default function Cart({ open, onClose, restaurantId }: Props) {
  const { items, total, clearCart, removeItem, increaseQuantity, decreaseQuantity, notes, setNotes } = useCart();
  const { table } = useTable();
  const { order: currentOrder, setOrder } = useOrder();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function sendOrder() {
    if (!items.length) return;
    if (!table.trim()) {
      setError("No hemos podido identificar la mesa. Escanea de nuevo el QR de tu mesa.");
      return;
    }
    try {
      setSending(true);
      setError("");
      const order = await createOrder({ restaurantId, table: table.trim(), items, notes, total });
      const newItems = items.map((item, index) => ({
        id: `local-${order.id}-${Date.now()}-${index}`,
        product_id: item.productId,
        name: item.name || "Producto",
        quantity: item.quantity,
        price: item.price,
        options: item.options ?? [],
      }));
      const existingItems = currentOrder && currentOrder.id === order.id ? currentOrder.items : [];

      setOrder({
        id: order.id,
        table: table.trim(),
        status: order.status,
        total: Number(order.total ?? total),
        items: [...existingItems, ...newItems],
      });
      clearCart();
      onClose();
    } catch (err) {
      console.error("Error enviando pedido", err);
      setError(err instanceof Error ? err.message : "No se ha podido enviar el pedido. Comprueba la conexión e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  const activeOrderTotal = Number(currentOrder?.total ?? 0);

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-800 bg-[#111110] text-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-[#181716] p-5">
          <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-500">Digital Bar</p><h2 className="mt-1 text-2xl font-bold">Tu pedido</h2></div>
          <button onClick={onClose} aria-label="Cerrar carrito" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X size={22} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {currentOrder && (
            <section className="mb-5 rounded-2xl border border-amber-500/20 bg-[#181716] p-4">
              <div className="flex items-center justify-between gap-3">
                <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Pedido en curso</p><p className="mt-1 font-semibold text-amber-400">Mesa {currentOrder.table}</p></div>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">{currentOrder.status === "pending" ? "Recibido" : currentOrder.status === "preparing" ? "Preparando" : currentOrder.status === "ready" ? "Listo" : "En curso"}</span>
              </div>
              <div className="mt-4 space-y-3">
                {currentOrder.items.map((item) => {
                  const extras = (item.options ?? []).reduce((sum, option) => sum + Number(option.extraPrice ?? 0), 0);
                  const subtotal = (Number(item.price) + extras) * Number(item.quantity);
                  return <div key={item.id} className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="text-sm font-medium text-white">{item.quantity} × {item.name || "Producto"}</p>{item.options?.length > 0 && <p className="mt-1 text-xs text-zinc-500">{item.options.map((option) => option.optionName).filter(Boolean).join(" · ")}</p>}</div><span className="shrink-0 text-sm font-semibold text-zinc-300">{subtotal.toFixed(2)} €</span></div>;
                })}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4"><span className="font-semibold text-white">Total pedido</span><span className="text-xl font-extrabold text-amber-500">{activeOrderTotal.toFixed(2)} €</span></div>
            </section>
          )}

          {items.length === 0 ? (
            currentOrder ? (
              <button type="button" onClick={onClose} className="w-full rounded-2xl border border-dashed border-amber-500/20 bg-[#151413] p-5 text-left transition hover:border-amber-500/40 hover:bg-[#191817]">
                <p className="font-medium text-white">Puedes seguir pidiendo</p>
                <p className="mt-1 text-sm text-zinc-500">Añade más productos desde la carta.</p>
              </button>
            ) : (
              <p className="py-12 text-center text-zinc-500">El carrito está vacío.</p>
            )
          ) : (
            <div className="space-y-4">
              <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Nuevos productos</p><p className="mt-1 text-sm text-zinc-400">Se añadirán a tu pedido actual al enviarlos.</p></div>
              {items.map((item, index) => {
                const extras = item.options.reduce((sum, option) => sum + option.extraPrice, 0);
                const subtotal = (item.price + extras) * item.quantity;
                return <div key={`${item.productId}-${index}`} className="rounded-2xl border border-zinc-800 bg-[#181716] p-4"><div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold text-white">{item.name || "Producto"}</h3>{item.options.length > 0 && <ul className="mt-2 space-y-1 text-sm text-zinc-400">{item.options.map((option, i) => <li key={i}>• {option.optionName}</li>)}</ul>}</div><button onClick={() => removeItem(index)} className="text-zinc-500 hover:text-red-400" aria-label="Eliminar producto"><Trash2 size={18} /></button></div><div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><button onClick={() => decreaseQuantity(index)} className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 hover:bg-zinc-800"><Minus size={16} /></button><span className="w-7 text-center font-medium">{item.quantity}</span><button onClick={() => increaseQuantity(index)} className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 hover:bg-zinc-800"><Plus size={16} /></button></div><span className="font-bold text-amber-500">{subtotal.toFixed(2)} €</span></div></div>;
              })}
              {table ? <div className="rounded-2xl border border-amber-500/20 bg-[#181716] p-4"><p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Mesa</p><p className="mt-1 text-lg font-semibold text-white">Mesa {table}</p><p className="mt-1 text-xs text-zinc-500">Identificada mediante el QR</p></div> : <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-4"><p className="text-sm text-zinc-400">No se ha identificado la mesa. Escanea de nuevo el QR.</p></div>}
              <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-4"><label className="mb-2 block text-sm font-semibold text-white">Observaciones</label><textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sin cebolla..." className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-500" /></div>
              {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300">{error}</div>}
            </div>
          )}
        </div>

        <footer className="border-t border-zinc-800 bg-[#181716] p-5">
          {items.length > 0 ? (
            <>
              <div className="mb-5 flex items-end justify-between"><div><span className="text-lg font-bold">Nuevos productos</span>{currentOrder && <p className="mt-1 text-xs text-zinc-500">Se sumarán al pedido actual</p>}</div><span className="text-3xl font-extrabold text-amber-500">{total.toFixed(2)} €</span></div>
              <div className="flex gap-3"><button type="button" onClick={() => { if (confirm("¿Cancelar los nuevos productos y vaciar el carrito?")) { clearCart(); onClose(); } }} disabled={sending} className="flex-1 rounded-xl border border-red-500/30 bg-transparent py-3 font-semibold text-red-400 hover:bg-red-950/30 disabled:opacity-40">Cancelar</button><button onClick={sendOrder} disabled={sending || !items.length} className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">{sending ? "Enviando..." : currentOrder ? "Añadir al pedido" : "Enviar pedido"}</button></div>
            </>
          ) : (
            <button type="button" onClick={onClose} className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400">Añadir al carrito</button>
          )}
        </footer>
      </aside>
    </>
  );
}

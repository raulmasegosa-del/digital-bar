"use client";

import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";
import { Trash2, Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { useOrder } from "@/context/OrderContext";
import { createOrder } from "@/lib/orders/createOrder";
import { buildWhatsAppMessage } from "@/lib/whatsapp";

type Props = { open: boolean; onClose: () => void; restaurantId: string };

export default function Cart({ open, onClose, restaurantId }: Props) {
  const { items, total, clearCart, removeItem, increaseQuantity, decreaseQuantity, notes, setNotes } = useCart();
  const { table, setTable } = useTable();
  const { setOrder } = useOrder();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);

  if (!open) return null;

  async function sendOrder() {
    if (!items.length) return;
    try {
      setSending(true);
      const order = await createOrder({ restaurantId, table, items, notes, total });
      setOrder({ id: order.id, table, status: order.status });
      void settings;
      void showToast;
      void buildWhatsAppMessage({ items, tableNumber: table, notes, total });
      clearCart();
      onClose();
    } catch (error) {
      console.error("ERROR COMPLETO:", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button aria-label="Cerrar carrito" onClick={onClose} className="fixed inset-0 z-40 cursor-default bg-black/70 backdrop-blur-sm" />
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-zinc-800 bg-[#121110] text-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black"><ShoppingBag size={19} /></div>
            <div>
              <h2 className="text-lg font-bold">Tu pedido</h2>
              <p className="text-xs text-zinc-500">Mesa {table || "—"}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {!items.length ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-[#181716] text-zinc-600"><ShoppingBag size={28} /></div>
              <p className="mt-4 font-semibold text-white">El carrito está vacío</p>
              <p className="mt-1 text-sm text-zinc-500">Añade productos de la carta para empezar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const extras = item.options.reduce((sum, option) => sum + option.extraPrice, 0);
                const subtotal = (item.price + extras) * item.quantity;
                const name = item.name?.trim() || "Producto";
                return (
                  <article key={`${item.productId}-${index}`} className="rounded-2xl border border-zinc-800 bg-[#181716] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-5 text-white">{name}</h3>
                        <p className="mt-1 text-sm text-amber-500">{Number(item.price + extras).toFixed(2)} € / unidad</p>
                        {item.options.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-zinc-500">{item.options.map((option, i) => <li key={i}>• {option.optionName}</li>)}</ul>
                        )}
                      </div>
                      <button onClick={() => removeItem(index)} aria-label={`Eliminar ${name}`} className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={17} /></button>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 p-1">
                        <button onClick={() => decreaseQuantity(index)} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800"><Minus size={15} /></button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => increaseQuantity(index)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black hover:bg-amber-400"><Plus size={15} /></button>
                      </div>
                      <span className="font-bold text-white">{subtotal.toFixed(2)} €</span>
                    </div>
                  </article>
                );
              })}

              <div className="space-y-2 pt-3">
                <label className="text-sm font-semibold text-white">Mesa</label>
                <input value={table} onChange={(e) => setTable(e.target.value)} placeholder="Ej. 1" className="w-full rounded-xl border border-zinc-700 bg-[#181716] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-500" />
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-white">Observaciones</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sin cebolla..." className="w-full resize-none rounded-xl border border-zinc-700 bg-[#181716] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-500" />
              </div>
            </div>
          )}
        </div>

        <footer className="border-t border-zinc-800 bg-[#121110] p-5">
          <div className="mb-4 flex items-end justify-between"><span className="text-sm text-zinc-500">Total</span><span className="text-2xl font-extrabold text-amber-500">{total.toFixed(2)} €</span></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { if (confirm("¿Cancelar el pedido y vaciar el carrito?")) { clearCart(); onClose(); } }} disabled={sending || !items.length} className="flex-1 rounded-xl border border-zinc-700 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-40">Cancelar</button>
            <button onClick={sendOrder} disabled={sending || !items.length} className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-40">{sending ? "Enviando..." : "Enviar pedido"}</button>
          </div>
        </footer>
      </aside>
    </>
  );
}

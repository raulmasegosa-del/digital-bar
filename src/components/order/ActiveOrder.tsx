"use client";

import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import { cancelOrder } from "@/lib/orders/cancelOrder";

const statusConfig = {
  pending: { icon: "🟡", title: "Pedido enviado", color: "text-amber-400" },
  preparing: { icon: "👨‍🍳", title: "Preparando tu pedido", color: "text-blue-400" },
  ready: { icon: "🍽️", title: "¡Pedido listo!", color: "text-green-400" },
  served: { icon: "✅", title: "Pedido servido", color: "text-green-400" },
  cancelled: { icon: "❌", title: "Pedido cancelado", color: "text-red-400" },
};

export default function ActiveOrder() {
  const { order, clearOrder } = useOrder();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const info = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending;

  async function handleCancel() {
    if (!order || !confirm("¿Cancelar este pedido?")) return;
    try {
      setLoading(true);
      await cancelOrder(order.id);
      clearOrder();
      showToast("🗑️ Pedido cancelado");
    } catch {
      showToast("❌ No se pudo cancelar");
    } finally {
      setLoading(false);
    }
  }

  function continueOrdering() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-h-[70vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#181716]/95 p-5 text-white shadow-2xl backdrop-blur sm:left-auto sm:right-6 sm:w-96">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{info.icon}</div>
        <div className="min-w-0"><p className="text-xs uppercase tracking-wide text-zinc-500">Pedido en curso</p><h3 className={`font-bold ${info.color}`}>{info.title}</h3></div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex items-center justify-between gap-3 text-sm"><span className="text-zinc-400">Mesa {order.table}</span><span className="text-zinc-500">#{order.id.slice(0, 8)}</span></div>
        <div className="mt-4 space-y-3">
          {order.items.length === 0 ? <p className="text-sm text-zinc-500">Cargando productos...</p> : order.items.map((item) => {
            const extras = (item.options ?? []).reduce((sum, option) => sum + Number(option.extraPrice ?? 0), 0);
            const subtotal = (Number(item.price) + extras) * Number(item.quantity);
            return <div key={item.id} className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="text-sm font-medium text-white">{item.quantity} × {item.name || "Producto"}</p>{item.options?.length > 0 && <p className="mt-1 text-xs text-zinc-500">{item.options.map((option) => option.optionName).filter(Boolean).join(" · ")}</p>}</div><span className="shrink-0 text-sm font-semibold text-zinc-300">{subtotal.toFixed(2)} €</span></div>;
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4"><span className="font-semibold text-white">Total</span><span className="text-xl font-extrabold text-amber-500">{Number(order.total).toFixed(2)} €</span></div>
      </div>

      <button onClick={continueOrdering} className="mt-4 w-full rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400">Seguir pidiendo</button>

      {order.status === "pending" && <button onClick={handleCancel} disabled={loading} className="mt-2 w-full rounded-xl border border-red-500/30 bg-transparent py-3 font-semibold text-red-400 transition hover:bg-red-950/30 disabled:opacity-50">{loading ? "Cancelando..." : "Cancelar pedido"}</button>}
    </div>
  );
}

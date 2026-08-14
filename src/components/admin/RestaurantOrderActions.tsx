"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@/types/orders";
import { updateRestaurantOrderStatus } from "@/app/admin/[slug]/orders/actions";

type Props = { slug: string; orderId: string; status: OrderStatus; orderIds?: string[]; total?: number };
type Action = { label: string; status: OrderStatus; tone: string };
type PaymentMethod = "cash" | "card";

const actionsByStatus: Partial<Record<OrderStatus, Action[]>> = {
  pending: [
    { label: "Preparando", status: "preparing", tone: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-400/15" },
  ],
  preparing: [
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
  ready: [
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
  served: [
    { label: "Preparando", status: "preparing", tone: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/15" },
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
  ],
  bill: [{ label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" }],
};

export default function RestaurantOrderActions({ slug, orderId, status, orderIds = [], total }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showPayment, setShowPayment] = useState(false);

  function changeStatus(nextStatus: OrderStatus, paymentMethod?: PaymentMethod) {
    startTransition(async () => {
      try {
        await updateRestaurantOrderStatus(slug, orderId, nextStatus, orderIds, paymentMethod);
        setShowPayment(false);
        window.location.reload();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "No se pudo actualizar el pedido");
      }
    });
  }

  const actions = actionsByStatus[status] ?? [];
  const isClosed = status === "completed" || status === "cancelled";

  return (
    <>
      <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
        {!isClosed && actions.map((action) => (
          <button key={action.status} type="button" disabled={isPending} onClick={() => changeStatus(action.status)} className={`min-h-10 rounded-lg border px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${action.tone}`}>
            {isPending ? "Actualizando…" : action.label}
          </button>
        ))}
        {!isClosed && <button type="button" disabled={isPending} onClick={() => setShowPayment(true)} className="min-h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs font-bold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40">{isPending ? "Actualizando…" : "Pagado"}</button>}
        {!isClosed && <button type="button" disabled={isPending} onClick={() => changeStatus("cancelled")} className="min-h-10 rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40">{isPending ? "Actualizando…" : "Cancelar"}</button>}
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#1a1917] p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Cerrar mesa</p>
                <h2 id="payment-title" className="mt-1 text-2xl font-black text-white">¿Cómo han pagado?</h2>
                {typeof total === "number" && <p className="mt-1 text-sm text-zinc-400">Total: <span className="font-bold text-white">{total.toFixed(2)} €</span></p>}
              </div>
              <button type="button" onClick={() => setShowPayment(false)} disabled={isPending} className="rounded-lg px-2 py-1 text-xl text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Cerrar">×</button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" disabled={isPending} onClick={() => changeStatus("completed", "cash")} className="min-h-28 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-center transition hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-50">
                <span className="block text-4xl">💵</span><span className="mt-2 block text-base font-black text-white">Efectivo</span>
              </button>
              <button type="button" disabled={isPending} onClick={() => changeStatus("completed", "card")} className="min-h-28 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-center transition hover:border-blue-400/60 hover:bg-blue-500/20 disabled:opacity-50">
                <span className="block text-4xl">💳</span><span className="mt-2 block text-base font-black text-white">Tarjeta</span>
              </button>
            </div>
            <button type="button" disabled={isPending} onClick={() => setShowPayment(false)} className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">Volver</button>
          </div>
        </div>
      )}
    </>
  );
}

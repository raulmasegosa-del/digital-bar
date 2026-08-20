"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@/types/orders";
import { updateRestaurantOrderStatus } from "@/app/admin/[slug]/orders/actions";

type Props = { slug: string; orderId: string; status: OrderStatus; orderIds?: string[]; total?: number; tableOrderIds?: string[]; tableTotal?: number };
type Action = { label: string; status: OrderStatus; tone: string };
type PaymentMethod = "cash" | "card";

const statusActions: Partial<Record<OrderStatus, Action[]>> = {
  pending: [
    { label: "Preparando", status: "preparing", tone: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/15" },
    { label: "Listo", status: "ready", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
    { label: "Servido", status: "served", tone: "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/15" },
  ],
  preparing: [
    { label: "Listo", status: "ready", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
    { label: "Servido", status: "served", tone: "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/15" },
  ],
  ready: [{ label: "Servido", status: "served", tone: "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/15" }],
};

export default function RestaurantOrderActions({ slug, orderId, status, orderIds = [], total, tableOrderIds = [], tableTotal }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const allIds = Array.from(new Set([orderId, ...orderIds, ...tableOrderIds]));
  const fullTotal = typeof tableTotal === "number" ? tableTotal : total;
  const hasOtherOrders = allIds.length > 1;

  function changeStatus(nextStatus: OrderStatus, paymentMethod?: PaymentMethod) {
    startTransition(async () => {
      try { await updateRestaurantOrderStatus(slug, orderId, nextStatus, allIds, paymentMethod); setShowPayment(false); setShowConfirm(false); window.location.reload(); }
      catch (error) { window.alert(error instanceof Error ? error.message : "No se pudo actualizar el pedido"); }
    });
  }
  function startPayment() { if (hasOtherOrders) setShowConfirm(true); else setShowPayment(true); }
  const actions = statusActions[status] ?? [];
  const isClosed = status === "completed" || status === "cancelled";

  return <>
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
      {!isClosed && actions.map((action) => <button key={action.status} type="button" disabled={isPending} onClick={() => changeStatus(action.status)} className={`min-h-10 rounded-lg border px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${action.tone}`}>{isPending ? "Actualizando…" : action.label}</button>)}
      {!isClosed && <span className="mx-1 hidden h-7 w-px bg-zinc-700 sm:block" aria-hidden="true" />}
      {!isClosed && <button type="button" disabled={isPending} onClick={startPayment} className="min-h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs font-bold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/25 disabled:opacity-40">Pagado</button>}
      {!isClosed && <button type="button" disabled={isPending} onClick={() => changeStatus("cancelled")} className="min-h-10 rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:opacity-40">Cancelar</button>}
    </div>

    {showConfirm && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#1a1917] p-6 shadow-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Cerrar mesa completa</p><h2 className="mt-2 text-2xl font-black text-white">La mesa tiene otros pedidos</h2><p className="mt-3 text-sm leading-6 text-zinc-400">Hay otros pedidos activos en esta mesa. Se juntarán todos en una única cuenta antes de cerrar.</p><div className="mt-5 rounded-xl border border-zinc-700 bg-[#11100f] p-4"><p className="text-xs text-zinc-500">Total de la mesa</p><p className="mt-1 text-3xl font-black text-white">{Number(fullTotal ?? 0).toFixed(2)} €</p><p className="mt-1 text-xs text-zinc-500">{allIds.length} pedidos</p></div><div className="mt-5 flex gap-3"><button type="button" onClick={() => setShowConfirm(false)} className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-300">Cancelar</button><button type="button" onClick={() => { setShowConfirm(false); setShowPayment(true); }} className="flex-1 rounded-xl bg-amber-600 px-4 py-3 font-bold text-white hover:bg-amber-500">Sí, juntar y cobrar</button></div></div></div>}

    {showPayment && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#1a1917] p-5 shadow-2xl sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Cerrar mesa</p><h2 className="mt-1 text-2xl font-black text-white">¿Cómo han pagado?</h2><p className="mt-1 text-sm text-zinc-400">Total: <span className="font-bold text-white">{Number(fullTotal ?? 0).toFixed(2)} €</span></p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" disabled={isPending} onClick={() => changeStatus("completed", "cash")} className="min-h-28 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 transition hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-50"><span className="block text-4xl">💵</span><span className="mt-2 block text-base font-black text-white">Efectivo</span></button><button type="button" disabled={isPending} onClick={() => changeStatus("completed", "card")} className="min-h-28 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 transition hover:border-blue-400/60 hover:bg-blue-500/20 disabled:opacity-50"><span className="block text-4xl">💳</span><span className="mt-2 block text-base font-black text-white">Tarjeta</span></button></div><button type="button" onClick={() => setShowPayment(false)} className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-300">Volver</button></div></div>}
  </>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { getPendingServiceCalls } from "@/app/actions/getPendingServiceCalls";
import { completeServiceCall } from "@/app/actions/completeServiceCall";
import { cancelServiceCall } from "@/app/actions/cancelServiceCall";
import { resolveBillServiceCall } from "@/app/actions/resolveBillServiceCall";

type ServiceCall = { id: string; table_number: string; type: "waiter" | "bill"; status: string; created_at: string; description?: string | null; restaurant_id: string };
type CallGroup = { key: string; table_number: string; type: ServiceCall["type"]; calls: ServiceCall[]; latest: ServiceCall };
type PaymentMethod = "cash" | "card";

export default function ServiceCallsBoard({ restaurantId }: { restaurantId: string }) {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [now, setNow] = useState(Date.now());
  const [paymentGroup, setPaymentGroup] = useState<CallGroup | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const firstLoad = useRef(true);

  async function loadCalls(playSound = false) {
    if (!restaurantId) return;
    try {
      const data = await getPendingServiceCalls(restaurantId);
      if (playSound && !firstLoad.current && data.length > calls.length) new Audio("/sounds/notification.mp3").play().catch(() => {});
      firstLoad.current = false;
      setCalls(data as ServiceCall[]);
    } catch (error) { console.error("No se pudieron cargar los avisos de servicio", error); }
  }

  useEffect(() => {
    if (!restaurantId) return;
    void loadCalls();
    const timer = setInterval(() => { setNow(Date.now()); void loadCalls(); }, 3000);
    return () => clearInterval(timer);
  }, [restaurantId]);

  const groups: CallGroup[] = Array.from(calls.reduce((map, call) => {
    const key = `${call.table_number}:${call.type}`;
    const existing = map.get(key);
    if (existing) { existing.calls.push(call); existing.latest = call; }
    else map.set(key, { key, table_number: call.table_number, type: call.type, calls: [call], latest: call });
    return map;
  }, new Map<string, CallGroup>()).values());

  async function resolveGroup(group: CallGroup) {
    if (group.type === "bill") { setPaymentGroup(group); return; }
    try { await Promise.all(group.calls.map((call) => completeServiceCall(call.id))); void loadCalls(); }
    catch (error) { window.alert(error instanceof Error ? error.message : "No se pudo resolver el aviso"); }
  }

  async function cancelGroup(group: CallGroup) {
    if (!window.confirm(`¿Cancelar el aviso de la mesa ${group.table_number}?`)) return;
    try { await Promise.all(group.calls.map((call) => cancelServiceCall(call.id))); void loadCalls(); }
    catch (error) { window.alert(error instanceof Error ? error.message : "No se pudo cancelar el aviso"); }
  }

  async function resolveBill(paymentMethod: PaymentMethod) {
    if (!paymentGroup) return;
    setIsResolving(true);
    try { await resolveBillServiceCall(restaurantId, paymentGroup.calls.map((call) => call.id), paymentMethod); setPaymentGroup(null); void loadCalls(); window.location.reload(); }
    catch (error) { window.alert(error instanceof Error ? error.message : "No se pudo cerrar la mesa"); }
    finally { setIsResolving(false); }
  }

  if (groups.length === 0 && !paymentGroup) return null;

  return <>
    {groups.length > 0 && <section className="mb-5 rounded-2xl border-2 border-red-500/40 bg-red-950/30 p-4 shadow-[0_10px_35px_rgba(239,68,68,0.12)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-white sm:text-2xl">🔔 Avisos de servicio</h2><p className="mt-1 text-xs text-red-200/70">Mesas que necesitan atención</p></div><span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-black text-white">{groups.length}</span></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{groups.map((group) => { const minutes = Math.max(0, Math.floor((now - new Date(group.latest.created_at).getTime()) / 60000)); const urgent = minutes >= 3; const count = group.calls.length; const waiter = group.type === "waiter"; const notes = waiter ? group.calls.map((call) => String(call.description ?? "").trim()).filter(Boolean).join("\n\n") : ""; return <div key={group.key} className={`flex items-center justify-between gap-3 rounded-xl border-2 p-4 shadow-lg transition-all ${urgent ? (waiter ? "animate-pulse border-sky-400 bg-sky-100 text-sky-950" : "animate-pulse border-amber-400 bg-amber-100 text-amber-950") : (waiter ? "border-sky-400/60 bg-sky-950/35 text-white" : "border-amber-400/60 bg-amber-950/35 text-white")}`}><div className="min-w-0"><div className="flex items-center gap-2"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${waiter ? "bg-sky-500/20" : "bg-amber-500/20"}`}>{waiter ? "🙋" : "💶"}</span><p className="text-xl font-black">Mesa {group.table_number}</p><span title={`${count} avisos pendientes`} className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-black text-white ${waiter ? "bg-sky-600" : "bg-amber-600"}`}>{count}</span></div><p className={`mt-2 text-sm font-bold ${waiter ? "text-sky-300" : "text-amber-300"}`}>{waiter ? "🙋 Llamar al camarero" : "💶 Pedir la cuenta"}</p>{notes && <div className="mt-3 whitespace-pre-line rounded-lg border border-sky-400/20 bg-black/15 px-3 py-2.5 text-sm font-medium leading-6 text-white"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Nota del cliente</p>{notes}</div>}<p className={`mt-2 text-xs font-semibold ${urgent ? (waiter ? "text-sky-700" : "text-amber-700") : "text-zinc-400"}`}>⏱ {minutes} min · {count === 1 ? "1 aviso" : `${count} avisos`}</p></div><div className="flex shrink-0 flex-col gap-2"><button onClick={() => resolveGroup(group)} disabled={isResolving} className="rounded-xl bg-green-600 px-4 py-2.5 font-bold text-white shadow hover:bg-green-700 active:scale-95 disabled:opacity-50">Resuelto</button><button onClick={() => void cancelGroup(group)} disabled={isResolving} className="rounded-xl border border-red-400/40 bg-red-950/50 px-4 py-2.5 font-bold text-red-200 hover:bg-red-900/60 active:scale-95 disabled:opacity-50">Cancelar</button></div></div>; })}</div>
    </section>}

    {paymentGroup && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="service-payment-title">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#1a1917] p-5 shadow-2xl sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Cerrar mesa {paymentGroup.table_number}</p><h2 id="service-payment-title" className="mt-1 text-2xl font-black text-white">¿Cómo han pagado?</h2><p className="mt-2 text-sm text-zinc-400">Selecciona el método de pago para cerrar la mesa y desactivar su sesión.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" disabled={isResolving} onClick={() => resolveBill("cash")} className="min-h-28 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-center transition hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-50"><span className="block text-4xl">💵</span><span className="mt-2 block text-base font-black text-white">Efectivo</span></button><button type="button" disabled={isResolving} onClick={() => resolveBill("card")} className="min-h-28 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 text-center transition hover:border-blue-400/60 hover:bg-blue-500/20 disabled:opacity-50"><span className="block text-4xl">💳</span><span className="mt-2 block text-base font-black text-white">Tarjeta</span></button></div><button type="button" disabled={isResolving} onClick={() => setPaymentGroup(null)} className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">Cancelar</button></div>
    </div>}
  </>;
}

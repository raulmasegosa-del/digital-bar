"use client";

import { useEffect, useRef, useState } from "react";
import { getPendingServiceCalls } from "@/app/actions/getPendingServiceCalls";
import { completeServiceCall } from "@/app/actions/completeServiceCall";

type ServiceCall = { id: string; table_number: string; type: "waiter" | "bill"; status: string; created_at: string; restaurant_id: string };
type CallGroup = { key: string; table_number: string; type: ServiceCall["type"]; calls: ServiceCall[]; latest: ServiceCall };

export default function ServiceCallsBoard({ restaurantId }: { restaurantId: string }) {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [now, setNow] = useState(Date.now());
  const firstLoad = useRef(true);

  async function loadCalls(playSound = false) {
    if (!restaurantId) return;
    try {
      const data = await getPendingServiceCalls(restaurantId);
      if (playSound && !firstLoad.current && data.length > calls.length) new Audio("/sounds/notification.mp3").play().catch(() => {});
      firstLoad.current = false;
      setCalls(data as ServiceCall[]);
    } catch (error) {
      console.error("No se pudieron cargar los avisos de servicio", error);
    }
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

  if (groups.length === 0) return null;

  return <section className="mb-5 rounded-2xl border-2 border-red-500/40 bg-red-950/30 p-4 shadow-[0_10px_35px_rgba(239,68,68,0.12)] sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-white sm:text-2xl">🔔 Avisos de servicio</h2><p className="mt-1 text-xs text-red-200/70">Mesas que necesitan atención</p></div><span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-black text-white">{groups.length}</span></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{groups.map((group) => { const minutes = Math.max(0, Math.floor((now - new Date(group.latest.created_at).getTime()) / 60000)); const urgent = minutes >= 3; const count = group.calls.length; const waiter = group.type === "waiter"; return <div key={group.key} className={`flex items-center justify-between gap-3 rounded-xl border-2 p-4 shadow-lg transition-all ${urgent ? (waiter ? "animate-pulse border-sky-400 bg-sky-100 text-sky-950" : "animate-pulse border-amber-400 bg-amber-100 text-amber-950") : (waiter ? "border-sky-400/60 bg-sky-950/35 text-white" : "border-amber-400/60 bg-amber-950/35 text-white")}`}><div className="min-w-0"><div className="flex items-center gap-2"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${waiter ? "bg-sky-500/20" : "bg-amber-500/20"}`}>{waiter ? "🙋" : "💶"}</span><p className="text-xl font-black">Mesa {group.table_number}</p><span title={`${count} avisos pendientes`} className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-black text-white ${waiter ? "bg-sky-600" : "bg-amber-600"}`}>{count}</span></div><p className={`mt-2 text-sm font-bold ${waiter ? "text-sky-300" : "text-amber-300"}`}>{waiter ? "🙋 Llamar al camarero" : "💶 Pedir la cuenta"}</p><p className={`mt-1 text-xs font-semibold ${urgent ? (waiter ? "text-sky-700" : "text-amber-700") : "text-zinc-400"}`}>⏱ {minutes} min · {count === 1 ? "1 aviso" : `${count} avisos`}</p></div><button onClick={async () => { await Promise.all(group.calls.map((call) => completeServiceCall(call.id))); void loadCalls(); }} className="shrink-0 rounded-xl bg-green-600 px-4 py-3 font-bold text-white shadow hover:bg-green-700 active:scale-95">Resuelto</button></div>; })}</div>
  </section>;
}

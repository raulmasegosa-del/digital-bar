"use client";

import { useEffect, useRef, useState } from "react";
import { completeServiceCall } from "@/lib/service/completeServiceCall";
import { supabase } from "@/lib/supabase/client";

type ServiceCall = {
  id: string;
  table_number: string;
  type: "waiter" | "bill";
  status: string;
  created_at: string;
};

type CallGroup = {
  key: string;
  table_number: string;
  type: ServiceCall["type"];
  calls: ServiceCall[];
  latest: ServiceCall;
};

export default function ServiceCallsBoard({ restaurantId }: { restaurantId: string }) {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [now, setNow] = useState(Date.now());
  const firstLoad = useRef(true);

  async function loadCalls(playSound = false) {
    const { data, error } = await supabase
      .from("service_calls")
      .select("id, table_number, type, status, created_at")
      .eq("restaurant_id", restaurantId)
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("No se pudieron cargar los avisos de servicio", error);
      return;
    }

    if (playSound && !firstLoad.current && (data?.length ?? 0) > calls.length) {
      new Audio("/sounds/notification.mp3").play().catch(() => {});
    }

    firstLoad.current = false;
    setCalls(data ?? []);
  }

  useEffect(() => {
    void loadCalls();

    const timer = setInterval(() => {
      setNow(Date.now());
      void loadCalls();
    }, 3000);

    const channel = supabase
      .channel(`service-calls-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_calls",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => void loadCalls(true)
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const groups: CallGroup[] = Array.from(
    calls.reduce((map, call) => {
      const key = `${call.table_number}:${call.type}`;
      const existing = map.get(key);
      if (existing) {
        existing.calls.push(call);
        existing.latest = call;
      } else {
        map.set(key, {
          key,
          table_number: call.table_number,
          type: call.type,
          calls: [call],
          latest: call,
        });
      }
      return map;
    }, new Map<string, CallGroup>()).values()
  );

  if (groups.length === 0) return null;

  return (
    <section className="mb-5 rounded-2xl border-2 border-red-500/40 bg-red-950/30 p-4 shadow-[0_10px_35px_rgba(239,68,68,0.12)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white sm:text-2xl">🔔 Avisos de servicio</h2>
          <p className="mt-1 text-xs text-red-200/70">Mesas que necesitan atención</p>
        </div>
        <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-black text-white">
          {groups.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const minutes = Math.max(0, Math.floor((now - new Date(group.latest.created_at).getTime()) / 60000));
          const urgent = minutes >= 3;
          const count = group.calls.length;

          return (
            <div
              key={group.key}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 p-4 shadow-lg transition-all ${
                urgent ? "animate-pulse border-red-500 bg-red-100 text-red-950" : "border-red-300/50 bg-white text-zinc-900"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black">Mesa {group.table_number}</p>
                  <span title={`${count} avisos pendientes`} className="flex h-7 min-w-7 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-black text-white">
                    {count}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold">
                  {group.type === "waiter" ? "🙋 Llamar al camarero" : "💶 Pedir la cuenta"}
                </p>
                <p className={`mt-1 text-xs font-semibold ${urgent ? "text-red-700" : "text-zinc-500"}`}>
                  ⏱ {minutes} min · {count === 1 ? "1 aviso" : `${count} avisos`}
                </p>
              </div>

              <button
                onClick={async () => {
                  await Promise.all(group.calls.map((call) => completeServiceCall(call.id)));
                  void loadCalls();
                }}
                className="shrink-0 rounded-xl bg-green-600 px-4 py-3 font-bold text-white shadow hover:bg-green-700 active:scale-95"
              >
                Resuelto
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

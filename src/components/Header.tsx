"use client";

import { useEffect, useState } from "react";
import { useTable } from "@/context/TableContext";
import { getCustomerOrderCounts, type CustomerOrderCounts } from "@/app/actions/getCustomerOrderCounts";

type Props = {
  restaurantName: string;
  restaurantId: string;
};

export default function Header({ restaurantName, restaurantId }: Props) {
  const { table, sessionError } = useTable();
  const [counts, setCounts] = useState<CustomerOrderCounts>({ received: 0, preparing: 0, served: 0 });

  useEffect(() => {
    if (!restaurantId || !table) return;

    let active = true;
    const load = async () => {
      try {
        const next = await getCustomerOrderCounts(restaurantId, table);
        if (active) setCounts(next);
      } catch (error) {
        console.error("No se pudieron actualizar los estados de los pedidos", error);
      }
    };

    void load();
    const timer = setInterval(() => void load(), 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [restaurantId, table]);

  return (
    <header className="border-b border-zinc-800 bg-[#181716] text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Digital Bar</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{restaurantName}</h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">Haz tu pedido directamente desde la mesa.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {table && (
              <div className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200">
                🪑 Mesa {table}
              </div>
            )}

            {table && (
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold">
                <span className="text-amber-300">🟡 {counts.received} recibido{counts.received === 1 ? "" : "s"}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-blue-300">👨‍🍳 {counts.preparing} preparando</span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-300">✅ {counts.served} servido{counts.served === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>
        </div>

        {sessionError && table && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {sessionError}
          </div>
        )}
      </div>
    </header>
  );
}

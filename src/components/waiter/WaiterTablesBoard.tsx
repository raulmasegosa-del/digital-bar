"use client";

import { useMemo, useState } from "react";

type Table = {
  number: number;
  name: string | null;
  zone: string | null;
  status: string;
  items: number;
  total: number;
  hasBillRequest: boolean;
};

type Props = { tables: Table[] };

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
  free: { label: "Libre", className: "bg-emerald-50 border-emerald-200 text-emerald-800", icon: "🟢" },
  pending: { label: "Recibido", className: "bg-amber-50 border-amber-200 text-amber-800", icon: "🟡" },
  preparing: { label: "Preparando", className: "bg-blue-50 border-blue-200 text-blue-800", icon: "🔵" },
  ready: { label: "Listo", className: "bg-green-50 border-green-200 text-green-800", icon: "🟢" },
  served: { label: "Servido", className: "bg-slate-100 border-slate-200 text-slate-700", icon: "⚪" },
  bill: { label: "Cuenta solicitada", className: "bg-red-50 border-red-200 text-red-800", icon: "🔴" },
};

export default function WaiterTablesBoard({ tables }: Props) {
  const [filter, setFilter] = useState("all");
  const visibleTables = useMemo(
    () => (filter === "all" ? tables : tables.filter((table) => table.status === filter)),
    [filter, tables]
  );

  return (
    <section>
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["all", "Todas"],
          ["free", "Libres"],
          ["pending", "Recibidos"],
          ["preparing", "Preparando"],
          ["ready", "Listos"],
          ["bill", "Cuenta"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === value ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleTables.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-500 shadow-sm">
          No hay mesas en este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleTables.map((table) => {
            const config = statusConfig[table.status] ?? statusConfig.free;
            return (
              <button
                key={table.number}
                type="button"
                className={`min-h-40 rounded-2xl border-2 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${config.className}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Mesa</p>
                    <p className="text-4xl font-black">{table.number}</p>
                  </div>
                  <span className="text-xl" aria-hidden="true">{config.icon}</span>
                </div>
                {table.name && <p className="mt-2 truncate text-sm font-medium">{table.name}</p>}
                {table.zone && <p className="truncate text-xs opacity-70">{table.zone}</p>}
                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs opacity-70">{config.label}</p>
                    {table.items > 0 && <p className="text-sm font-bold">{table.items} uds.</p>}
                  </div>
                  {table.total > 0 && <p className="text-lg font-black">{table.total.toFixed(2)} €</p>}
                </div>
                {table.hasBillRequest && (
                  <p className="mt-3 rounded-lg bg-red-600 px-2 py-1 text-center text-xs font-bold text-white">
                    💶 COBRAR
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

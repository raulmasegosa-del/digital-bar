"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, GripVertical, LayoutGrid, Pencil, Save } from "lucide-react";
import { saveTableLayout } from "@/app/admin/[slug]/tables/actions";
import type { RestaurantTable } from "@/lib/db/restaurants/tables/getRestaurantTables";
import type { TableStatus } from "@/types/tables";

type Props = {
  restaurantId: string;
  slug: string;
  tables: RestaurantTable[];
  statusByTable: Map<string, { status: TableStatus; items: number; total: number }>;
};

type Position = { x: number; y: number };

const statusStyles: Record<TableStatus, { label: string; ring: string; dot: string }> = {
  free: { label: "Libre", ring: "border-zinc-600", dot: "bg-zinc-500" },
  pending: { label: "Recibido", ring: "border-amber-400", dot: "bg-amber-400" },
  preparing: { label: "Preparando", ring: "border-blue-400", dot: "bg-blue-400" },
  ready: { label: "Listo", ring: "border-green-400", dot: "bg-green-400" },
  served: { label: "Servido", ring: "border-emerald-400", dot: "bg-emerald-400" },
  bill: { label: "Cuenta", ring: "border-red-400", dot: "bg-red-400" },
};

function initialPosition(table: RestaurantTable, index: number): Position {
  return {
    x: table.position_x ?? 10 + (index % 5) * 18,
    y: table.position_y ?? 14 + Math.floor(index / 5) * 22,
  };
}

export default function TableSalon({ restaurantId, slug, tables, statusByTable }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    Object.fromEntries(tables.map((table, index) => [table.id, initialPosition(table, index)]))
  );
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    if (!dragging) return;

    const move = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(8, Math.min(92, ((event.clientY - rect.top) / rect.height) * 100));
      setPositions((current) => ({ ...current, [dragging]: { x, y } }));
    };
    const up = () => setDragging(null);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  const save = async () => {
    setSaving(true);
    try {
      await saveTableLayout(
        restaurantId,
        slug,
        tables.map((table) => ({ tableId: table.id, ...(positions[table.id] ?? initialPosition(table, 0)) }))
      );
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-amber-400" />
            <h2 className="font-semibold text-white">Salón</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {editing ? "Arrastra las mesas para colocarlas como están en tu local." : "Tu salón de un vistazo. Pulsa una mesa para ver sus consumiciones."}
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800">Cancelar</button>
            <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar distribución"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/20">
            <Pencil className="h-4 w-4" /> Editar Salón
          </button>
        )}
      </div>

      <div ref={canvasRef} className={`relative min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(113,113,122,0.10)_1px,transparent_1px)] [background-size:24px_24px] ${editing ? "cursor-crosshair" : ""}`}>
        <div className="pointer-events-none absolute inset-5 rounded-2xl border border-dashed border-zinc-800" />
        {tables.map((table, index) => {
          const position = positions[table.id] ?? initialPosition(table, index);
          const tableStatus = statusByTable.get(String(table.number));
          const status = tableStatus?.status ?? "free";
          const style = statusStyles[status];

          const object = (
            <div className={`relative flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-2 ${style.ring} bg-zinc-900/95 shadow-xl transition ${editing ? "hover:scale-105" : "hover:scale-105"}`}>
              <div className="absolute inset-x-6 top-7 h-11 rounded-xl border-2 border-zinc-500 bg-zinc-800 shadow-inner" />
              <div className="absolute left-4 top-9 h-7 w-2 rounded-full bg-zinc-500" />
              <div className="absolute right-4 top-9 h-7 w-2 rounded-full bg-zinc-500" />
              <span className="relative z-10 mt-12 text-xl font-black text-white">{table.number}</span>
              <span className={`relative z-10 mt-1 inline-flex items-center gap-1 rounded-full bg-zinc-950/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-300`}>
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {style.label}
              </span>
              {tableStatus && <span className="relative z-10 mt-1 text-[10px] text-zinc-500">{tableStatus.items} productos · {tableStatus.total.toFixed(2)} €</span>}
              {editing && <GripVertical className="absolute right-1 top-1 h-4 w-4 text-zinc-500" />}
            </div>
          );

          return editing ? (
            <button key={table.id} type="button" onPointerDown={(event) => { event.preventDefault(); setDragging(table.id); }} className="absolute -translate-x-1/2 -translate-y-1/2 touch-none focus:outline-none focus:ring-2 focus:ring-amber-400" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
              {object}
            </button>
          ) : (
            <Link key={table.id} href={`/admin/${slug}/tables/${table.id}`} className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-amber-400" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
              {object}
            </Link>
          );
        })}

        {tables.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">Crea tu primera mesa para empezar a diseñar el salón.</div>}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-[11px] text-zinc-400 shadow-lg">
          {Object.entries(statusStyles).map(([key, value]) => <span key={key} className="inline-flex items-center gap-1"><span className={`h-2 w-2 rounded-full ${value.dot}`} />{value.label}</span>)}
          {editing && <span className="ml-1 inline-flex items-center gap-1 border-l border-zinc-700 pl-2 text-amber-300"><Check className="h-3 w-3" /> Modo edición</span>}
        </div>
      </div>
    </section>
  );
}

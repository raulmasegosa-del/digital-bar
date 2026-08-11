"use client";

import { regenerateTableQr, toggleTable, updateTable } from "@/app/admin/[slug]/tables/actions";

export default function TableRowActions({
  restaurantId,
  slug,
  table,
}: {
  restaurantId: string;
  slug: string;
  table: { id: string; number: number; name: string | null; zone: string | null; active: boolean };
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={async (formData) => updateTable(restaurantId, table.id, formData)} className="flex flex-wrap gap-2">
        <input name="number" type="number" min="1" defaultValue={table.number} className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white" />
        <input name="name" defaultValue={table.name ?? ""} placeholder="Nombre" className="w-32 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white" />
        <input name="zone" defaultValue={table.zone ?? ""} placeholder="Zona" className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white" />
        <input type="hidden" name="active" value={table.active ? "on" : "off"} />
        <button type="submit" className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700">Guardar</button>
      </form>

      <form action={async () => toggleTable(restaurantId, slug, table.id, !table.active)}>
        <button type="submit" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
          {table.active ? "Desactivar" : "Activar"}
        </button>
      </form>

      <form action={async () => regenerateTableQr(restaurantId, slug, table.id)}>
        <button type="submit" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">Regenerar QR</button>
      </form>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersRound } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import TableCreateForm from "@/components/admin/tables/TableCreateForm";
import TableRowActions from "@/components/admin/tables/TableRowActions";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";
import { getTablesStatus } from "@/lib/tables/getTablesStatus";
import type { TableStatus } from "@/types/tables";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const occupancy = {
  free: { label: "Libre", dot: "bg-zinc-500", ring: "border-zinc-700", people: 0 },
  pending: { label: "Pedido recibido", dot: "bg-amber-400", ring: "border-amber-400/50", people: 1 },
  preparing: { label: "Preparando", dot: "bg-blue-400", ring: "border-blue-400/50", people: 1 },
  ready: { label: "Listo", dot: "bg-green-400", ring: "border-green-400/50", people: 2 },
  served: { label: "Comiendo", dot: "bg-emerald-400", ring: "border-emerald-400/50", people: 2 },
  bill: { label: "Cobro", dot: "bg-red-400", ring: "border-red-400/50", people: 2 },
} satisfies Record<TableStatus, { label: string; dot: string; ring: string; people: number }>;

function TableOccupancy({ status }: { status: TableStatus }) {
  const info = occupancy[status];
  const occupied = info.people > 0;

  return (
    <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${info.ring} bg-zinc-900`}>
      <div className="h-6 w-10 rounded-lg border-2 border-zinc-500 bg-zinc-800" />
      {occupied && (
        <>
          <div className="absolute -left-1 top-1/2 flex -translate-y-1/2 flex-col items-center">
            <span className="h-3 w-3 rounded-full border border-zinc-900 bg-zinc-300" />
            <span className="-mt-0.5 h-3.5 w-5 rounded-t-full bg-zinc-300" />
          </div>
          {info.people > 1 && (
            <div className="absolute -right-1 top-1/2 flex -translate-y-1/2 flex-col items-center">
              <span className="h-3 w-3 rounded-full border border-zinc-900 bg-zinc-300" />
              <span className="-mt-0.5 h-3.5 w-5 rounded-t-full bg-zinc-300" />
            </div>
          )}
          <span className={`absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#181716] ${info.dot} px-1 text-[10px] font-bold text-zinc-950`}>
            {info.people}
          </span>
        </>
      )}
    </div>
  );
}

export default async function TablesPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const [tables, statuses] = await Promise.all([
    getRestaurantTables(restaurant.id),
    getTablesStatus(restaurant.id),
  ]);

  const statusByTable = new Map(statuses.map((status) => [status.number, status]));

  return (
    <main className="space-y-8">
      <PageHeader title="Mesas" description={`Gestiona las mesas de ${restaurant.name}.`} />

      <TableCreateForm restaurantId={restaurant.id} slug={slug} />

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
        <div className="flex flex-col gap-3 border-b border-zinc-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Mesas configuradas</h2>
            <p className="mt-1 text-sm text-zinc-500">{tables.length} mesas en este restaurante.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="rounded-full bg-zinc-900 px-3 py-1">● Libre</span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">● Ocupada</span>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-500">No hay mesas configuradas todavía.</div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-zinc-800 md:grid-cols-2">
            {tables.map((table) => {
              const tableStatus = statusByTable.get(String(table.number));
              const status = tableStatus?.status ?? "free";
              const info = occupancy[status];

              return (
                <div key={table.id} className="flex flex-col gap-4 bg-[#181716] px-6 py-5 transition hover:bg-zinc-900/50 lg:flex-row lg:items-center lg:justify-between">
                  <Link href={`/admin/${slug}/tables/${table.id}`} className="flex min-w-0 items-center gap-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <div className="relative">
                      <TableOccupancy status={status} />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded bg-[#181716] px-1.5 text-[10px] font-bold text-zinc-300">{table.number}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{table.name || `Mesa ${table.number}`}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${status === "free" ? "bg-zinc-800 text-zinc-400" : "bg-amber-500/10 text-amber-300"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
                          {info.label}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{table.zone || "Sin zona"} · {table.active ? "Activa" : "Inactiva"}</p>
                      {tableStatus && <p className="mt-1 text-xs text-zinc-400">{tableStatus.items} productos · {tableStatus.total.toFixed(2)} €</p>}
                      <p className="mt-1 text-xs font-medium text-amber-500">Ver consumiciones →</p>
                    </div>
                  </Link>

                  <TableRowActions restaurantId={restaurant.id} slug={slug} table={table} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import TableCreateForm from "@/components/admin/tables/TableCreateForm";
import TableRowActions from "@/components/admin/tables/TableRowActions";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TablesPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const tables = await getRestaurantTables(restaurant.id);

  return (
    <main className="space-y-8">
      <PageHeader
        title="Mesas"
        description={`Gestiona las mesas de ${restaurant.name}.`}
      />

      <TableCreateForm restaurantId={restaurant.id} slug={slug} />

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="font-semibold text-white">Mesas configuradas</h2>
            <p className="mt-1 text-sm text-zinc-500">{tables.length} mesas en este restaurante.</p>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-zinc-500">
            No hay mesas configuradas todavía.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {tables.map((table) => (
              <div key={table.id} className="flex flex-col gap-4 px-6 py-5 transition hover:bg-zinc-900/50 lg:flex-row lg:items-center lg:justify-between">
                <Link href={`/admin/${slug}/tables/${table.id}`} className="flex min-w-0 items-center gap-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-lg font-semibold text-white">
                    {table.number}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white">{table.name || `Mesa ${table.number}`}</p>
                    <p className="text-sm text-zinc-500">
                      {table.zone || "Sin zona"} · {table.active ? "Activa" : "Inactiva"}
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-500">Ver consumiciones →</p>
                  </div>
                </Link>

                <TableRowActions
                  restaurantId={restaurant.id}
                  slug={slug}
                  table={table}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

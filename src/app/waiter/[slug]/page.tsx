import { notFound, redirect } from "next/navigation";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";
import { getTablesStatus } from "@/lib/tables/getTablesStatus";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import WaiterTablesBoard from "@/components/waiter/WaiterTablesBoard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function WaiterPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/waiter/${slug}/login`);

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("restaurant_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("restaurant_id", restaurant.id)
    .in("role", ["owner", "staff"])
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membership) redirect(`/waiter/${slug}/login`);

  const [tables, statuses] = await Promise.all([
    getRestaurantTables(restaurant.id),
    getTablesStatus(restaurant.id),
  ]);

  const statusByTable = new Map(statuses.map((status) => [status.number, status]));
  const boardTables = tables.filter((table) => table.active).map((table) => {
    const status = statusByTable.get(String(table.number));
    return {
      number: table.number,
      name: table.name,
      zone: table.zone,
      status: status?.status ?? "free",
      items: status?.items ?? 0,
      total: status?.total ?? 0,
      hasBillRequest: status?.status === "bill",
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Modo camarero</p>
            <h1 className="text-3xl font-bold text-slate-900">{restaurant.name}</h1>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">Mesas</span>
        </header>
        <WaiterTablesBoard tables={boardTables} slug={slug} />
      </div>
    </main>
  );
}

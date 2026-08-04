import TablesGrid from "@/components/tables/TablesGrid";
import { getTablesStatus } from "@/lib/tables/getTablesStatus";
import TablesRealtime from "@/components/tables/TablesRealtime";
export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const tables = await getTablesStatus();

 return (
  <main className="space-y-8">
    <TablesRealtime />

    <h1 className="text-4xl font-bold">
      🪑 Mesas
    </h1>

    <TablesGrid items={tables} />
  </main>
);
}
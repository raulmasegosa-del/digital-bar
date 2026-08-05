import PageHeader from "@/components/ui/PageHeader";

import TablesGrid from "@/components/tables/TablesGrid";
import TablesRealtime from "@/components/tables/TablesRealtime";

import { getTablesStatus } from "@/lib/tables/getTablesStatus";

export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const tables = await getTablesStatus();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Mesas"
        description="Gestiona el servicio del restaurante."
        backHref="/admin"
        backLabel="Dashboard"
      />

      <TablesRealtime />

      <TablesGrid items={tables} />
    </main>
  );
}
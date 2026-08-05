import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import TableDetail from "@/components/tables/TableDetail";

import { getTable } from "@/lib/tables/getTable";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    number: string;
  }>;
};

export default async function TablePage({
  params,
}: Props) {
  const { number } = await params;

  const table = await getTable(number);

  if (!table) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title={`Mesa ${number}`}
        description="Pedido actual y estado de la mesa."
        backHref="/admin/tables"
        backLabel="Todas las mesas"
      />

      <div className="mx-auto max-w-3xl">
        <TableDetail table={table} />
      </div>
    </main>
  );
}
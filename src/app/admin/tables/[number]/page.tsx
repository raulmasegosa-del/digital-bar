import { notFound } from "next/navigation";

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
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-3xl">
        <TableDetail table={table} />
      </div>
    </main>
  );
}
import TableCard from "./TableCard";

import type { TableInfo } from "@/types/tables";
type Props = {
  items: TableInfo[];
};

export default function TablesGrid({
  items,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
        No hay mesas activas.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((table) => (
        <TableCard
          key={table.number}
          number={table.number}
          status={table.status}
          total={table.total}
          items={table.items}
          createdAt={table.createdAt}
        />
      ))}
    </div>
  );
}
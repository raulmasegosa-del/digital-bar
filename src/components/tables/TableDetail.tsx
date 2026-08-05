import TableActions from "./TableActions";

import { TableOrder } from "@/types/tables";

type Props = {
  table: TableOrder;
};

export default function TableDetail({
  table,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">
        🍽 Mesa {table.table_number}
      </h1>

     <div className="mb-6">
  <span
    className={`rounded-full px-3 py-1 text-sm font-medium ${
      table.status === "ready"
        ? "bg-green-200 text-green-800"
        : table.status === "preparing"
        ? "bg-blue-100 text-blue-700"
        : table.status === "served"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {table.status === "ready"
      ? "🍽️ Listo para servir"
      : table.status === "preparing"
      ? "👨‍🍳 Preparando"
      : table.status === "served"
      ? "🧑‍🍳 Servido"
      : table.status}
  </span>
</div>

      <div className="space-y-4">
        {table.order_items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">
                {item.quantity} × {item.name}
              </p>

              {item.notes && (
                <p className="text-sm text-gray-500">
                  {item.notes}
                </p>
              )}
            </div>

            <span className="font-semibold">
  {(item.price * item.quantity).toFixed(2)} €
</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6 text-xl font-bold">
        <span>Total</span>

        <span>
          {Number(table.total).toFixed(2)} €
        </span>
      </div>

      <TableActions
        orderId={table.id}
        status={table.status}
      />
    </div>
  );
}
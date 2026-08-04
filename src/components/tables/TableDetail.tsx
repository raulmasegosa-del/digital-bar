type Props = {
  table: any;
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
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          Estado: {table.status}
        </span>
      </div>

      <div className="space-y-4">
        {table.order_items?.map(
          (item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div>
                <p className="font-medium">
                  {item.quantity} ×{" "}
                  {item.menu_items?.name}
                </p>

                {item.notes && (
                  <p className="text-sm text-gray-500">
                    {item.notes}
                  </p>
                )}
              </div>

              <span className="font-semibold">
                {Number(
                  item.unit_price *
                    item.quantity
                ).toFixed(2)}{" "}
                €
              </span>
            </div>
          )
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6 text-xl font-bold">
        <span>Total</span>

        <span>
          {Number(
            table.total ?? 0
          ).toFixed(2)}{" "}
          €
        </span>
      </div>
    </div>
  );
}
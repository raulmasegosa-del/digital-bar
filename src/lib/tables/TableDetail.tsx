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

      <div className="space-y-4">
        {table.order_items.map(
          (item: any) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-2"
            >
              <span>
                {item.quantity} ×{" "}
                {item.menu_items?.name}
              </span>

              <span>
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

      <div className="mt-8 flex justify-between border-t pt-6 text-xl font-bold">
        <span>Total</span>

        <span>
          {Number(table.total).toFixed(2)} €
        </span>
      </div>
    </div>
  );
}
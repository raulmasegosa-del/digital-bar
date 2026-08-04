import KitchenCard from "@/components/kitchen/KitchenCard";
import type { Order } from "@/types/orders";

type Props = {
  orders: Order[];
};

function sortByCreatedAt(
  orders: Order[]
) {
  return [...orders].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );
}

export default function KitchenBoard({
  orders,
}: Props) {
  const pending = sortByCreatedAt(
    orders.filter(
      (order) => order.status === "pending"
    )
  );

  const preparing = sortByCreatedAt(
    orders.filter(
      (order) => order.status === "preparing"
    )
  );

  const served = sortByCreatedAt(
    orders.filter(
      (order) => order.status === "served"
    )
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <KitchenColumn
        title="🟡 Nuevos"
        orders={pending}
      />

      <KitchenColumn
        title="🔵 Preparando"
        orders={preparing}
      />

      <KitchenColumn
        title="🟢 Listos"
        orders={served}
      />
    </div>
  );
}

type ColumnProps = {
  title: string;
  orders: Order[];
};

function KitchenColumn({
  title,
  orders,
}: ColumnProps) {
  return (
    <section className="rounded-2xl bg-gray-50 p-4">
      <h2 className="mb-4 text-xl font-bold">
        {title}
      </h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-gray-400">
            Sin pedidos
          </div>
        ) : (
          orders.map((order) => (
            <KitchenCard
              key={order.id}
              order={order}
            />
          ))
        )}
      </div>
    </section>
  );
}
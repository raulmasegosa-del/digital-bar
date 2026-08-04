type Product = {
  name: string;
  quantity: number;
  revenue: number;
};

type Props = {
  products: Product[];
};

export default function TopProducts({
  products,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        🏆 Más vendidos
      </h2>

      <div className="space-y-3">
        {products.map(
          (product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {["🥇", "🥈", "🥉"][
                    index
                  ] ?? "🍽️"}
                </span>

                <div>
                  <p className="font-semibold">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {product.quantity} uds
                  </p>
                </div>
              </div>

              <p className="font-bold text-amber-600">
                {product.revenue.toFixed(
                  2
                )} €
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
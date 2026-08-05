type Product = {
  id: string;
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
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Más vendidos
      </h2>

      <div className="space-y-3">
        {products.map((product, index) => (
          <article
            key={product.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-gray-100
              p-4
              transition
              hover:bg-gray-50
            "
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 font-semibold text-amber-600">
                {index + 1}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {product.name}
                </p>

                <p className="text-sm text-gray-500">
                  {product.quantity} unidades
                </p>
              </div>
            </div>

            <p className="font-semibold text-amber-600">
              {product.revenue.toFixed(2)} €
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
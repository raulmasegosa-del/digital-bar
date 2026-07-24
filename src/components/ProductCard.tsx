import { MenuItem } from "@/types/menu";

type ProductCardProps = {
  product: MenuItem;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.available ?? true;

  return (
    <article
      className={`rounded-xl border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      {product.featured && (
        <div className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          ⭐ Recomendado
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          {!isAvailable && (
            <p className="mt-1 text-sm font-semibold text-red-600">
              🚫 Agotado
            </p>
          )}
        </div>

        <span className="whitespace-nowrap text-lg font-bold text-amber-700">
          {product.price.toFixed(2)} €
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {product.description}
      </p>
    </article>
  );
}
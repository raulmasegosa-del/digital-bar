import Badge from "@/components/ui/Badge";
import { MenuItem } from "@/types/menu";
import PriceList from "@/components/ui/PriceList";
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
      {product.featured && <Badge>Recomendado</Badge>}

      <h3 className="mt-4 text-2xl font-bold text-gray-900">
        {product.name}
      </h3>

      {product.subtitle && (
        <p className="mt-1 text-sm italic text-gray-500">
          {product.subtitle}
        </p>
      )}

      {!isAvailable && (
        <p className="mt-2 text-sm font-semibold text-red-600">
          🚫 Agotado
        </p>
      )}

      {product.description && (
        <p className="mt-4 text-gray-600">
          {product.description}
        </p>
      )}

      <PriceList prices={product.prices} />
    </article>
  );
}
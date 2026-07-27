import Image from "next/image";

import Badge from "@/components/ui/Badge";
import PriceList from "@/components/ui/PriceList";

import { MenuItem } from "@/types/menu";

type ProductCardProps = {
  product: MenuItem;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const isAvailable = product.available ?? true;

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={500}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100">
          <span className="text-6xl">🍽️</span>

          <p className="mt-3 text-sm font-medium text-amber-700">
            Imagen próximamente
          </p>
        </div>
      )}

      <div className="p-5">
        {product.featured && (
          <Badge>
            Recomendado
          </Badge>
        )}

        <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
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
          <p className="mt-4 leading-6 text-gray-600">
            {product.description}
          </p>
        )}

        <PriceList prices={product.prices} />
      </div>
    </article>
  );
}
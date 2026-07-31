import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import { AdminProduct } from "@/types/admin";

type Props = {
  item: AdminProduct;
};

export default function ProductCard({ item }: Props) {
  const price = item.menu_prices?.[0]?.price ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Imagen */}
      <div className="flex h-52 items-center justify-center bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-6xl">🍽️</span>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">
              {item.name}
            </h3>

            <p className="text-sm text-gray-500">
              {item.categories?.name ?? "Sin categoría"}
            </p>
          </div>

          {item.featured && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              ⭐ Destacado
            </span>
          )}
        </div>

        {item.subtitle && (
          <p className="font-medium text-gray-700">
            {item.subtitle}
          </p>
        )}

        {item.description && (
          <p className="min-h-[48px] text-sm text-gray-500">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-3xl font-bold text-amber-600">
            {Number(price).toFixed(2)} €
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              item.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.available ? "Disponible" : "Oculto"}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            href={`/admin/edit/${item.id}`}
            className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-center font-medium text-white transition hover:bg-amber-700"
          >
            ✏️ Editar
          </Link>

          <DeleteButton id={item.id} />
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import type { AdminOptionItem } from "@/types/admin";

type Props = {
  item: AdminOptionItem;
};

export default function OptionItemCard({
  item,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        {item.name}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Grupo: {item.option_groups?.name ?? "-"}
      </p>

      <p className="mt-4 text-2xl font-bold text-amber-600">
        +{item.extra_price.toFixed(2)} €
      </p>

      <span
        className={`mt-4 inline-block rounded-full px-3 py-1 text-sm ${
          item.available
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {item.available
          ? "Disponible"
          : "No disponible"}
      </span>

      <div className="mt-6 flex gap-2">
        <Link
          href={`/admin/options/edit/${item.id}`}
          className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-center text-white transition hover:bg-amber-700"
        >
          Editar
        </Link>

        <button
          type="button"
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
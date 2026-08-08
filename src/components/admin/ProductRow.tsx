import Link from "next/link";

import ProductAvailabilitySwitch from "@/components/admin/ProductAvailabilitySwitch";

import type { AdminProduct } from "@/types/admin";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type Props = {
  item: AdminProduct;
  slug: string;
};

export default function ProductRow({
  item,
  slug,
}: Props) {
  return (
    <tr>
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-gray-900">
            {item.name}
          </p>

          {item.subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {item.subtitle}
            </p>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <Badge>
          {item.categories?.name ?? "Sin categoría"}
        </Badge>
      </td>

      <td className="px-6 py-4 font-semibold text-amber-700">
        {item.menu_prices?.length
          ? `${Number(
              item.menu_prices[0].price
            ).toFixed(2)} €`
          : "-"}
      </td>

      <td className="px-6 py-4 text-center">
        <ProductAvailabilitySwitch
          id={item.id}
          available={item.available}
        />
      </td>

      <td className="px-6 py-4 text-center">
        {item.featured ? "⭐" : "—"}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <Link
            href={`/admin/${slug}/products/${item.id}`}
          >
            <Button>
              ✏️ Editar
            </Button>
          </Link>

          <Button variant="danger">
            🗑 Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
}
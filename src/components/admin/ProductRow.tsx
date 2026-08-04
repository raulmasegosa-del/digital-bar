import Link from "next/link";
import ProductAvailabilitySwitch from "@/components/admin/ProductAvailabilitySwitch";
import type { AdminProduct } from "@/types/admin";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type Props = {
  item: AdminProduct;
};

export default function ProductRow({
  item,
}: Props) {
  return (
    <tr className="border-t transition hover:bg-amber-50">
      <td className="p-4">
        <div>
          <p className="font-semibold">
            {item.name}
          </p>

          {item.subtitle && (
            <p className="text-sm text-gray-500">
              {item.subtitle}
            </p>
          )}
        </div>
      </td>

      <td className="p-4">
        {item.categories?.name ?? "-"}
      </td>

      <td className="p-4 font-semibold text-amber-700">
        {item.menu_prices?.length
          ? `${Number(
              item.menu_prices[0].price
            ).toFixed(2)} €`
          : "-"}
      </td>

      <td className="p-4 text-center">
       <ProductAvailabilitySwitch
  id={item.id}
  available={item.available}
/>
      </td>

      <td className="p-4 text-center text-xl">
        {item.featured ? "⭐" : "—"}
      </td>

      <td className="p-4">
        <div className="flex justify-center gap-2">
          <Link
            href={`/admin/edit/${item.id}`}
          >
            <Button>
              Editar
            </Button>
          </Link>

          <Button variant="danger">
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
}
import Link from "next/link";
import { AdminProduct } from "@/types/admin";

type Props = {
  item: AdminProduct;
};

export default function ProductRow({ item }: Props) {
  return (
    <tr className="border-t hover:bg-amber-50">
      <td className="p-3 font-medium">
        {item.name}
      </td>

      <td className="p-3">
        {item.categories?.name ?? "-"}
      </td>

      <td className="p-3">
        {item.menu_prices?.length
          ? `${Number(item.menu_prices[0].price).toFixed(2)} €`
          : "-"}
      </td>

      <td className="p-3 text-center">
        {item.available ? "✅" : "❌"}
      </td>

      <td className="p-3 text-center">
        {item.featured ? "⭐" : ""}
      </td>

      <td className="p-3 text-center space-x-2">
        <Link
          href={`/admin/edit/${item.id}`}
          className="rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700"
        >
          Editar
        </Link>

        <button className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">
          Eliminar
        </button>
      </td>
    </tr>
  );
}
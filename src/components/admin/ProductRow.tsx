import { MenuItem } from "@/types/menu";

type Props = {
  item: MenuItem;
};

export default function ProductRow({ item }: Props) {
  return (
    <tr className="border-t hover:bg-amber-50">
      <td className="p-3 font-medium">
        {item.name}
      </td>

      <td className="p-3">
        {item.categoryId}
      </td>

      <td className="p-3">
        {item.prices
          .map((p) => `${p.price.toFixed(2)} €`)
          .join(" / ")}
      </td>

      <td className="p-3 text-center">
        {item.available ? "✅" : "❌"}
      </td>

      <td className="p-3 text-center">
        {item.featured ? "⭐" : ""}
      </td>

      <td className="p-3 text-center">
        <button className="rounded bg-amber-600 px-3 py-1 text-sm text-white transition hover:bg-amber-700">
          Editar
        </button>
      </td>
    </tr>
  );
}
import { getAdminProducts } from "@/lib/db/admin";
import ProductRow from "./ProductRow";

export default async function ProductTable() {
  const items = await getAdminProducts();

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow">
      <table className="w-full">
        <thead className="bg-amber-100">
          <tr>
            <th className="p-3 text-left">Producto</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-center">Disponible</th>
            <th className="p-3 text-center">⭐</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items?.map((item) => (
            <ProductRow
              key={item.id}
              item={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
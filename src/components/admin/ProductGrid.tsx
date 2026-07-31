import ProductCard from "@/components/admin/ProductCard";
import { getAdminProducts } from "@/lib/db/admin";
import { AdminProduct } from "@/types/admin";

export default async function ProductGrid() {
  const products: AdminProduct[] = await getAdminProducts();

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No hay productos
        </h2>

        <p className="mt-2 text-gray-500">
          Pulsa en <strong>Nuevo producto</strong> para crear el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}
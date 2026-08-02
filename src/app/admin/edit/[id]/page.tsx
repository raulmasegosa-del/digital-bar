import ProductForm from "@/components/admin/ProductForm";
import {
  getCategories,
  getOptionGroups,
  getProduct,
  getProductOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-amber-50 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">
            Producto no encontrado
          </h1>

          <p className="mt-2 text-gray-600">
            No existe ningún producto con ese ID.
          </p>
        </div>
      </main>
    );
  }

  const categories = await getCategories();
  const optionGroups = await getOptionGroups();
  const selectedOptionGroups =
    await getProductOptionGroups(id);

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm
          item={{
            ...product,
            price: product.menu_prices?.[0]?.price ?? 0,
          }}
          categories={categories}
          optionGroups={optionGroups}
          selectedOptionGroups={selectedOptionGroups}
        />
      </div>
    </main>
  );
}
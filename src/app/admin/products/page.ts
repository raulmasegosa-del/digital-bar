import ProductForm from "@/components/admin/ProductForm";
import {
  getCategories,
  getProduct,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm
          item={{
            ...product,
            price: product.menu_prices?.[0]?.price ?? 0,
          }}
          categories={categories}
        />
      </div>
    </main>
  );
}
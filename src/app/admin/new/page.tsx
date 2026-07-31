import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/db/admin";
export const dynamic = "force-dynamic";
export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm categories={categories} />
      </div>
    </main>
  );
}
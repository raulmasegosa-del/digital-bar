import ProductForm from "@/components/admin/ProductForm";
import {
  getCategories,
  getOptionGroups,
  getProduct,
  getProductOptionGroups,
} from "@/lib/db/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
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
            subtitle: product.subtitle ?? "",
            description:
              product.description ?? "",
            image: product.image ?? "",
            price:
              product.menu_prices?.[0]?.price ?? 0,
          }}
          categories={categories}
          optionGroups={optionGroups}
          selectedOptionGroups={
            selectedOptionGroups
          }
        />
      </div>
    </main>
  );
}
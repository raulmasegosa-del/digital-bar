import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import {
  getCategories,
  getOptionGroups,
  getProduct,
  getProductOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const [
    product,
    categories,
    optionGroups,
    productGroups,
  ] = await Promise.all([
    getProduct(id),
    getCategories(),
    getOptionGroups(),
    getProductOptionGroups(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-2xl">
        <ProductForm
          item={{
            ...product,
            subtitle: product.subtitle ?? "",
            description: product.description ?? "",
            image: product.image ?? "",
            price:
              product.menu_prices?.[0]?.price ?? 0,
          }}
          categories={categories}
          optionGroups={optionGroups}
          selectedOptionGroups={productGroups}
        />
      </div>
    </main>
  );
}
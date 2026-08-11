import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import ProductForm from "@/components/admin/ProductForm";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import {
  getCategories,
  getOptionGroups,
  getProduct,
  getProductOptionGroups,
} from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { slug, id } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

const [
  product,
  categories,
  optionGroups,
  productGroups,
] = await Promise.all([
  getProduct(id, restaurant.id),
  getCategories(restaurant.id),
  getOptionGroups(restaurant.id),
  getProductOptionGroups(id),
]);
  if (!product) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title="Editar producto"
        description={restaurant.name}
        backHref={`/admin/${slug}/products`}
        backLabel="Productos"
      />

      <div className="mx-auto max-w-3xl">
        <ProductForm
          item={{
            ...product,
            subtitle: product.subtitle ?? "",
            description: product.description ?? "",
            image: product.image ?? "",
            price:
              product.menu_prices?.[0]?.price ?? 0,
          }}
          restaurantId={restaurant.id}
          slug={slug}
          categories={categories}
          optionGroups={optionGroups}
          selectedOptionGroups={productGroups}
        />
      </div>
    </main>
  );
}
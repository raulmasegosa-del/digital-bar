import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/form/PrimaryButton";
import ProductTable from "@/components/admin/ProductTable";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getAdminProducts } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductsPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const products = await getAdminProducts(
    restaurant.id
  );

  return (
    <>
      <PageHeader
        title="Productos"
        description={restaurant.name}
      />

      <div className="mb-6 flex items-center justify-end">
        <Link href={`/admin/${slug}/products/new`}>
          <PrimaryButton>
            ➕ Nuevo producto
          </PrimaryButton>
        </Link>
      </div>

      <ProductTable
        items={products}
        slug={slug}
      />
    </>
  );
}
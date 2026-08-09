import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/form/PrimaryButton";
import CategoryGrid from "@/components/admin/CategoryGrid";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getCategories } from "@/lib/db/admin";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoriesPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const categories = await getCategories(
    restaurant.id
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Categorías"
        description="Gestiona las categorías de tu carta."
      />

      <div className="flex justify-end">
        <Link href={`/admin/${slug}/categories/new`}>
          <PrimaryButton>
            ➕ Nueva categoría
          </PrimaryButton>
        </Link>
      </div>

      <CategoryGrid
        categories={categories}
        slug={slug}
      />
    </main>
  );
}
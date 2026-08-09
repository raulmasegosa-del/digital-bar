import { notFound } from "next/navigation";

import CategoryForm from "@/components/admin/CategoryForm";

import { getCategory } from "@/lib/db/admin";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { slug, id } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const category = await getCategory(
    id,
    restaurant.id
  );

  if (!category) {
    notFound();
  }

  return (
    <CategoryForm
      item={category}
      slug={slug}
      restaurantId={restaurant.id}
    />
  );
}
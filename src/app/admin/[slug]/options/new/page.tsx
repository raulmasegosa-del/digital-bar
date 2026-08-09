import { notFound } from "next/navigation";

import OptionForm from "@/components/admin/OptionForm";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewOptionGroupPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <OptionForm
        slug={slug}
        restaurantId={restaurant.id}
      />
    </main>
  );
}
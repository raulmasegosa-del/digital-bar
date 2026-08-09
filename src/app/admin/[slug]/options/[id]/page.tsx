import { notFound } from "next/navigation";

import OptionForm from "@/components/admin/OptionForm";

import {
  getOptionGroup,
} from "@/lib/db/admin";

import {
  getRestaurant,
} from "@/lib/db/restaurants/getRestaurant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function EditOptionGroupPage({
  params,
}: Props) {
  const { slug, id } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const group = await getOptionGroup(
    id,
    restaurant.id
  );

  if (!group) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <OptionForm
        slug={slug}
        restaurantId={restaurant.id}
        initialData={group}
      />
    </main>
  );
}
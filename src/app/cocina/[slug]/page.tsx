import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import KitchenBoard from "@/components/kitchen/KitchenBoard";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CocinaRestaurantPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  return (
    <main className="space-y-8 p-6">
      <PageHeader
        title={`Cocina · ${restaurant.name}`}
        description="Pedidos que están entrando y preparando en este restaurante."
      />

      <KitchenBoard restaurantId={restaurant.id} />
    </main>
  );
}

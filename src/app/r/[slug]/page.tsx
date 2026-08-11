import { notFound } from "next/navigation";

import Header from "@/components/Header";
import MenuClient from "@/components/MenuClient";
import CartUI from "@/components/CartUI";
import OrderRealtime from "@/components/order/OrderRealtime";
import WaiterActions from "@/components/waiter/WaiterActions";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantMenu } from "@/lib/db/restaurants/menu/getRestaurantMenu";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicRestaurantPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const menu = await getRestaurantMenu(restaurant.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header restaurantName={restaurant.name} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <WaiterActions />

        <MenuClient menu={menu} />

        <CartUI restaurantId={restaurant.id} />

        <OrderRealtime />
      </div>
    </main>
  );
}

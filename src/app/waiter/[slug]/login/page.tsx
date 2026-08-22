import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { notFound } from "next/navigation";
import WaiterLoginForm from "@/components/waiter/WaiterLoginForm";

type Props = { params: Promise<{ slug: string }> };

export default async function WaiterLoginPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  return (
    <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <WaiterLoginForm restaurantName={restaurant.name} slug={slug} />
    </main>
  );
}

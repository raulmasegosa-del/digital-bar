import KitchenBoard from "@/components/kitchen/KitchenBoard";
import { getOrders } from "../admin/getOrders";


export default async function CocinaPage() {

  const orders = await getOrders();


  return (

    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-4xl font-bold">
          👨‍🍳 Cocina
        </h1>


        <KitchenBoard orders={orders}/>


      </div>

    </main>

  );
}
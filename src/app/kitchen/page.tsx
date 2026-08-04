import { getOrders } from "@/lib/orders/getOrders";
import OrderActions from "@/components/admin/OrderActions";

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const orders = await getOrders();

  const activeOrders = orders.filter(
    (order: any) =>
      order.status !== "completed" &&
      order.status !== "cancelled"
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-4xl font-bold">
          👨‍🍳 Cocina
        </h1>


        {activeOrders.length === 0 ? (

          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-xl text-gray-500">
              No hay pedidos pendientes
            </p>
          </div>

        ) : (


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


            {activeOrders.map((order: any) => (

              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >

                <div className="mb-4 flex items-center justify-between">

                  <h2 className="text-2xl font-bold">
                    Mesa {order.table_number || "-"}
                  </h2>


                  <span
                    className={`
                    rounded-full px-3 py-1 text-sm font-semibold
                    ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        :
                      order.status === "preparing"
                        ? "bg-blue-100 text-blue-700"
                        :
                        "bg-green-100 text-green-700"
                    }
                    `}
                  >
                    {order.status}
                  </span>

                </div>



                <div className="mb-5 space-y-3">


                  {order.order_items?.map(
                    (item:any) => (

                    <div
                      key={item.id}
                      className="border-b pb-3"
                    >

                      <div className="flex justify-between">

                        <span className="font-semibold">
                          {item.quantity} x {item.name}
                        </span>


                      </div>


                      {item.options &&
                      item.options.length > 0 && (

                        <ul className="mt-1 text-sm text-gray-500">

                          {item.options.map(
                            (option:any,index:number)=>(

                            <li key={index}>
                              • {option.optionName}
                            </li>

                          ))}

                        </ul>

                      )}

                    </div>

                  ))}


                </div>



                {order.notes && (

                  <div className="mb-5 rounded-xl bg-amber-50 p-3">

                    <p className="font-semibold">
                      📝 Observaciones
                    </p>

                    <p className="text-sm">
                      {order.notes}
                    </p>

                  </div>

                )}



               <OrderActions
  orderId={order.id}
  currentStatus={order.status}
/>


              </div>

            ))}


          </div>

        )}

      </div>

    </main>
  );
}
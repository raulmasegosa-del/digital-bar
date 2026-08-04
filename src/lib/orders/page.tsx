import { getOrders } from "@/lib/orders/getOrders";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {

  const orders = await getOrders();


  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Pedidos
        </h1>

        <p className="text-gray-500">
          Gestión de pedidos recibidos.
        </p>
      </div>


      {orders.length === 0 ? (

        <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
          No hay pedidos todavía.
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">


          {orders.map((order:any) => (

            <div
              key={order.id}
              className="
              rounded-2xl
              border
              bg-white
              p-5
              shadow-sm
              "
            >

              <div className="mb-4 flex justify-between">

                <h2 className="text-xl font-bold">
                  🪑 Mesa {order.table_number || "-"}
                </h2>


                <span className="
                rounded-full
                bg-amber-100
                px-3
                py-1
                text-sm
                font-semibold
                text-amber-700
                ">
                  {order.status || "Nuevo"}
                </span>

              </div>



              <div className="space-y-3">

                {order.order_items?.map((item:any)=>(
                  <div
                    key={item.id}
                    className="border-b pb-2"
                  >

                    <p className="font-semibold">
                      {item.quantity} × {item.name}
                    </p>


                    {item.options?.length > 0 && (

                      <ul className="ml-3 text-sm text-gray-500">

                        {item.options.map(
                          (option:any,index:number)=>(
                            <li key={index}>
                              • {option.optionName}
                            </li>
                          )
                        )}

                      </ul>

                    )}

                  </div>
                ))}

              </div>



              {order.notes && (

                <div className="
                mt-4
                rounded-lg
                bg-gray-100
                p-3
                text-sm
                ">

                  📝 {order.notes}

                </div>

              )}



              <div className="
              mt-5
              flex
              justify-between
              border-t
              pt-4
              ">

                <span className="font-bold">
                  Total
                </span>


                <span className="
                text-xl
                font-bold
                text-amber-600
                ">
                  {Number(order.total).toFixed(2)} €
                </span>

              </div>


            </div>

          ))}


        </div>

      )}

    </div>
  );
}
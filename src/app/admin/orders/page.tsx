import { getOrders } from "@/lib/orders/getOrders";
import OrderActions from "@/components/admin/OrderActions";

export const dynamic = "force-dynamic";


function getStatusStyle(status: string) {

  switch (status) {

    case "preparando":
      return {
        label: "🔵 Preparando",
        className: "bg-blue-100 text-blue-700",
      };


    case "servido":
      return {
        label: "🟢 Servido",
        className: "bg-green-100 text-green-700",
      };


    case "cerrado":
      return {
        label: "⚫ Cerrado",
        className: "bg-gray-200 text-gray-700",
      };


    default:
      return {
        label: "🟡 Pendiente",
        className: "bg-amber-100 text-amber-700",
      };

  }
}



function formatDate(date:string){

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      hour:"2-digit",
      minute:"2-digit",
      day:"2-digit",
      month:"2-digit",
    }
  ).format(
    new Date(date)
  );

}



export default async function OrdersPage() {

  const orders = await getOrders();


  return (

    <main className="min-h-screen bg-amber-50 p-6">

      <div className="mx-auto max-w-6xl">


        <h1 className="mb-2 text-3xl font-bold text-amber-700">
          📋 Pedidos
        </h1>


        <p className="mb-8 text-gray-600">
          Gestión de pedidos recibidos.
        </p>



        {
        orders.length === 0 ? (

          <div className="
          rounded-xl
          border
          bg-white
          p-8
          text-center
          text-gray-500
          ">
            No hay pedidos todavía.
          </div>


        ) : (


          <div className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-3
          ">


          {
          orders.map((order:any)=>{


            const status =
              getStatusStyle(
                order.status
              );


            return (

              <div
                key={order.id}
                className={`
                rounded-2xl
                border
                bg-white
                p-5
                shadow-sm
                `}
              >


                <div className="
                mb-4
                flex
                items-start
                justify-between
                ">


                  <div>

                    <h2 className="text-xl font-bold">
                      🪑 Mesa {order.table_number || "-"}
                    </h2>


                    {
                    order.created_at && (

                      <p className="mt-1 text-sm text-gray-500">
                        🕒 {formatDate(order.created_at)}
                      </p>

                    )
                    }

                  </div>



                  <span
                    className={`
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    ${status.className}
                    `}
                  >
                    {status.label}
                  </span>


                </div>





                <div className="space-y-3">


                {
                order.order_items?.map(
                  (item:any)=>(

                    <div
                      key={item.id}
                      className="
                      border-b
                      pb-3
                      "
                    >

                      <p className="font-semibold">
                        {item.quantity} × {item.name}
                      </p>


                      {
                      item.options?.length>0 && (

                        <ul className="
                        ml-4
                        text-sm
                        text-gray-500
                        ">

                        {
                        item.options.map(
                          (option:any,index:number)=>(

                            <li key={index}>
                              • {option.optionName}
                            </li>

                          )
                        )
                        }

                        </ul>

                      )
                      }

                    </div>

                  )
                )
                }


                </div>




                {
                order.notes && (

                  <div className="
                  mt-4
                  rounded-lg
                  bg-gray-100
                  p-3
                  text-sm
                  ">
                    📝 {order.notes}
                  </div>

                )
                }





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




                <OrderActions
                  orderId={order.id}
                  currentStatus={
                    order.status
                  }
                />


              </div>

            );


          })
          }


          </div>


        )
        }


      </div>

    </main>

  );

}
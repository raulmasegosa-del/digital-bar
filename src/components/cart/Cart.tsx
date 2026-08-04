"use client";
import { useToast } from "@/context/ToastContext";

import { useSettings } from "@/context/SettingsContext";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { useOrder } from "@/context/OrderContext";
import { createOrder } from "@/lib/orders/createOrder";

import {
  buildWhatsAppMessage,
  openWhatsApp,
} from "@/lib/whatsapp";


type Props = {
  open: boolean;
  onClose: () => void;
};


export default function Cart({
  open,
  onClose,
}: Props) {


  const {
    items,
    total,
    clearCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    notes,
    setNotes,
  } = useCart();


  const {
  table,
  setTable,
} = useTable();

const { setOrder } = useOrder();

const { settings } = useSettings();
const { showToast } = useToast();

const [sending, setSending] = useState(false);

  if (!open) return null;



  async function sendOrder() {
  if (items.length === 0) return;

  try {
    setSending(true);

    // Guardar pedido en Supabase
const order = await createOrder({
  table,
  items,
  notes,
  total,
});
setOrder({
  id: order.id,
  table,
  status: order.status,
});
console.log("SET ORDER", {
  id: order.id,
  table,
  status: order.status,
});
    // Crear mensaje WhatsApp
    const message = buildWhatsAppMessage({
      items,
      tableNumber: table,
      notes,
      total,
    });

    // Abrir WhatsApp
  //  openWhatsApp(
    //  settings.whatsapp,
      //message
    //);

    // Limpiar carrito
    clearCart();

    // Cerrar panel
    onClose();
  } catch (error) {
    console.error("ERROR COMPLETO:", error);

   if (error instanceof Error) {
} else {
}

  } finally {
    setSending(false);
  }
}



  return (
    <>


      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />



      <aside
        className="
        fixed right-0 top-0 z-50
        flex h-screen w-full
        max-w-md flex-col
        bg-white shadow-2xl
        "
      >



        {/* CABECERA */}

        <div className="
          flex items-center justify-between
          border-b p-5
        ">

          <h2 className="text-2xl font-bold">
            🛒 Tu pedido
          </h2>


          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>


        </div>




        {/* PRODUCTOS */}


        <div className="
          flex-1 overflow-y-auto p-5
        ">


          {items.length === 0 ? (

            <p className="text-center text-gray-500">
              El carrito está vacío.
            </p>


          ) : (


            <div className="space-y-4">


              {items.map((item,index)=>{


                const extras =
                  item.options.reduce(
                    (sum,option)=>
                      sum + option.extraPrice,
                    0
                  );


                const subtotal =
                  (item.price + extras)
                  *
                  item.quantity;



                return (

                  <div
                    key={index}
                    className="
                    rounded-xl border p-4 shadow-sm
                    "
                  >


                    <div className="
                      flex justify-between
                    ">


                      <div>

                        <h3 className="font-semibold">
                          {item.name}
                        </h3>



                        {item.options.length > 0 && (

                          <ul className="
                            mt-2 text-sm text-gray-500
                          ">

                            {item.options.map(
                              (option,i)=>(

                                <li key={i}>
                                  • {option.optionName}
                                </li>

                              )
                            )}

                          </ul>

                        )}


                      </div>



                      <button
                        onClick={() =>
                          removeItem(index)
                        }
                        className="text-red-600"
                      >

                        <Trash2 size={18}/>

                      </button>


                    </div>




                    <div className="
                      mt-4 flex items-center justify-between
                    ">


                      <div className="
                        flex items-center gap-3
                      ">


                        <button
                          onClick={() =>
                            decreaseQuantity(index)
                          }
                          className="rounded-lg border p-2"
                        >
                          <Minus size={16}/>
                        </button>



                        <span>
                          {item.quantity}
                        </span>



                        <button
                          onClick={() =>
                            increaseQuantity(index)
                          }
                          className="rounded-lg border p-2"
                        >
                          <Plus size={16}/>
                        </button>


                      </div>




                      <span className="
                        font-bold text-amber-600
                      ">

                        {subtotal.toFixed(2)} €

                      </span>


                    </div>


                  </div>

                );

              })}





              {/* MESA */}

              <div>

                <label className="
                  mb-2 block font-semibold
                ">
                  Mesa
                </label>


                <input

                  value={table}

                  onChange={(e)=>
                    setTable(e.target.value)
                  }

                  placeholder="Ej. 12"

                  className="
                  w-full rounded-xl border p-3
                  "

                />

              </div>





              {/* NOTAS */}


              <div>

                <label className="
                  mb-2 block font-semibold
                ">
                  Observaciones
                </label>


                <textarea

                  rows={4}

                  value={notes}

                  onChange={(e)=>
                    setNotes(e.target.value)
                  }


                  placeholder="Sin cebolla..."

                  className="
                  w-full rounded-xl border p-3
                  "

                />

              </div>


            </div>


          )}


        </div>





        {/* PIE */}


        <div className="border-t p-5">
  <div className="mb-5 flex justify-between">
    <span className="text-xl font-bold">
      Total
    </span>

    <span className="text-3xl font-bold text-amber-600">
      {total.toFixed(2)} €
    </span>
  </div>

  <div className="flex gap-3">
    <button
      type="button"
      onClick={() => {
        if (
          confirm(
            "¿Cancelar el pedido y vaciar el carrito?"
          )
        ) {
          clearCart();
          onClose();
        }
      }}
      disabled={sending || items.length === 0}
      className="
        flex-1 rounded-xl
        border border-red-300
        bg-white
        py-3
        font-semibold
        text-red-600
        transition
        hover:bg-red-50
        disabled:opacity-50
      "
    >
      🗑️ Cancelar pedido
    </button>

    <button
      onClick={sendOrder}
      disabled={sending || items.length === 0}
      className="
        flex-1 rounded-xl
        bg-green-600
        py-3
        font-semibold
        text-white
        transition
        hover:bg-green-700
        disabled:opacity-50
      "
    >
      {sending
        ? "Enviando..."
        : "Enviar pedido"}
    </button>
  </div>
</div>



      </aside>


    </>
  );
}
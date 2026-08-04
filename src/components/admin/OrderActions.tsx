"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/orders/updateOrderStatus";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function OrderActions({
  orderId,
  currentStatus,
}: Props) {

  const router = useRouter();

  const [status, setStatus] = useState(
    currentStatus || "pendiente"
  );

  const [loading, setLoading] = useState(false);


  async function changeStatus(
    newStatus: string
  ) {

    try {

      setLoading(true);


      await updateOrderStatus(
        orderId,
        newStatus
      );


      setStatus(newStatus);


      // Actualiza los datos del servidor
      router.refresh();


    } catch (error) {

      console.error(error);

      alert(
        "❌ Error actualizando el pedido"
      );


    } finally {

      setLoading(false);

    }

  }



  return (
    <div className="mt-5 space-y-3">


      <div className="
        flex
        items-center
        justify-between
      ">

        <span className="text-sm font-semibold text-gray-600">
          Estado:
        </span>


        <span className="
          rounded-full
          bg-gray-100
          px-3
          py-1
          text-sm
          font-semibold
        ">
          {status}
        </span>

      </div>



      <div className="
        grid
        grid-cols-3
        gap-2
      ">


        <button
          disabled={loading}
          onClick={() =>
            changeStatus("pendiente")
          }
          className="
            rounded-lg
            border
            px-3
            py-2
            text-sm
            hover:bg-gray-100
            disabled:opacity-50
          "
        >
          🟡 Pendiente
        </button>



        <button
          disabled={loading}
          onClick={() =>
            changeStatus("preparando")
          }
          className="
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-sm
            text-white
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          🔵 Preparar
        </button>



        <button
          disabled={loading}
          onClick={() =>
            changeStatus("servido")
          }
          className="
            rounded-lg
            bg-green-600
            px-3
            py-2
            text-sm
            text-white
            hover:bg-green-700
            disabled:opacity-50
          "
        >
          🟢 Servido
        </button>


      </div>



      <button
        disabled={loading}
        onClick={() =>
          changeStatus("cerrado")
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          px-3
          py-2
          text-sm
          hover:bg-gray-100
          disabled:opacity-50
        "
      >
        ⚫ Cerrar pedido
      </button>


      {
        loading && (
          <p className="
            text-center
            text-sm
            text-gray-500
          ">
            Actualizando...
          </p>
        )
      }


    </div>
  );
}
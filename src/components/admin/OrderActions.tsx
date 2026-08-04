"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/orders/updateOrderStatus";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function OrderActions({
  orderId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(
    currentStatus || "pending"
  );

  const [loading, setLoading] =
    useState(false);

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
    } catch {
      alert(
        "❌ Error actualizando el pedido"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">
          Estado:
        </span>

        <span
          className="
            rounded-full
            bg-gray-100
            px-3
            py-1
            text-sm
            font-semibold
          "
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          disabled={loading}
          onClick={() =>
            changeStatus("pending")
          }
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          🟡
        </button>

        <button
          disabled={loading}
          onClick={() =>
            changeStatus("preparing")
          }
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          👨‍🍳
        </button>

        <button
          disabled={loading}
          onClick={() =>
            changeStatus("ready")
          }
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600 disabled:opacity-50"
        >
          🍽️
        </button>

        <button
          disabled={loading}
          onClick={() =>
            changeStatus("served")
          }
          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
        >
          ✅
        </button>
      </div>

      <button
        disabled={loading}
        onClick={() =>
          changeStatus("cancelled")
        }
        className="w-full rounded-lg border border-red-300 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        ❌ Cancelar pedido
      </button>
    </div>
  );
}
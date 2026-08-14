"use client";

import { useState } from "react";

import { useTable } from "@/context/TableContext";
import { useToast } from "@/context/ToastContext";
import { createServiceCall } from "@/lib/service/createServiceCall";

export default function WaiterActions({ restaurantId }: { restaurantId: string }) {
  const { table } = useTable();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function sendCall(type: "waiter" | "bill") {
    if (!table) {
      showToast("⚠️ No se ha detectado la mesa.");
      return;
    }

    try {
      setLoading(true);
      await createServiceCall({ table, type, restaurantId });
      showToast(
        type === "waiter"
          ? `🙋 Camarero avisado para la mesa ${table}`
          : `💶 Cuenta solicitada para la mesa ${table}`
      );
    } catch (error) {
      console.error("No se pudo crear el aviso de servicio", error);
      showToast(
        type === "waiter"
          ? "❌ No se pudo avisar al camarero."
          : "❌ No se pudo solicitar la cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 grid grid-cols-2 gap-3">
      <button
        onClick={() => void sendCall("waiter")}
        disabled={loading}
        className="rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        🙋 Llamar al camarero
      </button>
      <button
        onClick={() => void sendCall("bill")}
        disabled={loading}
        className="rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        💶 Pedir la cuenta
      </button>
    </div>
  );
}

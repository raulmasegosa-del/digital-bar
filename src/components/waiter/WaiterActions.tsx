"use client";

import { useState } from "react";
import { useTable } from "@/context/TableContext";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import { createServiceCall } from "@/lib/service/createServiceCall";

export default function WaiterActions({ restaurantId }: { restaurantId: string }) {
  const { table } = useTable();
  const { order } = useOrder();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const canRequestBill = Boolean(order && order.items.length > 0 && order.status !== "cancelled");

  async function sendCall(type: "waiter" | "bill") {
    if (!table) { showToast("⚠️ No se ha detectado la mesa."); return; }
    if (type === "bill" && !canRequestBill) {
      showToast("ℹ️ Primero tienes que hacer un pedido para poder pedir la cuenta.");
      return;
    }
    try {
      setLoading(true);
      await createServiceCall({ table, type, restaurantId });
      showToast(type === "waiter" ? `🙋 Camarero avisado para la mesa ${table}` : `💶 Cuenta solicitada para la mesa ${table}`);
    } catch (error) {
      console.error("No se pudo crear el aviso de servicio", error);
      showToast(type === "waiter" ? "❌ No se pudo avisar al camarero." : "❌ No se pudo solicitar la cuenta.");
    } finally { setLoading(false); }
  }

  return <div className="mb-8 grid grid-cols-2 gap-3">
    <button onClick={() => void sendCall("waiter")} disabled={loading} className="rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50">🙋 Llamar al camarero</button>
    <button onClick={() => void sendCall("bill")} disabled={loading || !canRequestBill} title={!canRequestBill ? "Haz un pedido antes de pedir la cuenta" : "Pedir la cuenta"} className="rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">💶 Pedir la cuenta</button>
  </div>;
}

"use client";

import { useState } from "react";

import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import { cancelOrder } from "@/lib/orders/cancelOrder";

const statusConfig = {
  pending: { icon: "🟡", title: "Esperando confirmación", color: "text-yellow-600" },
  preparing: { icon: "👨‍🍳", title: "Preparando tu pedido", color: "text-blue-600" },
  ready: { icon: "🍽️", title: "¡Pedido listo!", color: "text-green-600" },
  served: { icon: "✅", title: "Pedido servido", color: "text-green-700" },
  cancelled: { icon: "❌", title: "Pedido cancelado", color: "text-red-600" },
};

export default function ActiveOrder() {
  const { order, clearOrder } = useOrder();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const info = statusConfig[order.status as keyof typeof statusConfig];

  async function handleCancel() {
    if (!order || !confirm("¿Cancelar este pedido?")) return;

    try {
      setLoading(true);
      await cancelOrder(order.id);
      clearOrder();
      showToast("🗑️ Pedido cancelado");
    } catch {
      showToast("❌ No se pudo cancelar");
    } finally {
      setLoading(false);
    }
  }

  function continueOrdering() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 rounded-2xl border bg-white/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{info.icon}</div>
        <div>
          <p className="text-xs text-gray-500">Pedido en curso</p>
          <h3 className={`font-bold ${info.color}`}>{info.title}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-1 text-sm">
        <p><strong>Pedido:</strong> #{order.id.slice(0, 8)}</p>
        <p><strong>Mesa:</strong> {order.table}</p>
      </div>

      <button
        onClick={continueOrdering}
        className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800"
      >
        Seguir pidiendo
      </button>

      {order.status === "pending" && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          {loading ? "Cancelando..." : "Cancelar pedido"}
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  useOrder,
  type OrderStatus,
} from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";

export default function OrderRealtime() {
  const {
    order,
    updateStatus,
    clearOrder,
  } = useOrder();

  const { showToast } = useToast();

  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            status: OrderStatus;
          };

          if (row.id !== order.id) return;

          updateStatus(row.status);

          switch (row.status) {
            case "preparing":
              showToast(
                "👨‍🍳 La cocina está preparando tu pedido"
              );
              break;

            case "ready":
              showToast(
                "🍽️ ¡Tu pedido está listo!"
              );

              if (
                typeof window !== "undefined" &&
                "vibrate" in navigator
              ) {
                navigator.vibrate([300, 150, 300]);
              }

              break;

            case "served":
              showToast(
                "✅ Pedido servido"
              );
              clearOrder();
              break;

            case "cancelled":
              showToast(
                "❌ Pedido cancelado"
              );
              clearOrder();
              break;
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    order?.id,
    updateStatus,
    clearOrder,
    showToast,
  ]);

  return null;
}
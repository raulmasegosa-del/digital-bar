"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase/client";

import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";

import type { OrderStatus } from "@/types/orders";
import { handleOrderStatus } from "@/lib/orders/handleOrderStatus";


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

          handleOrderStatus({
            status: row.status,
            showToast,
            updateStatus,
            clearOrder,
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    order?.id,
    showToast,
    updateStatus,
    clearOrder,
  ]);

  return null;
}
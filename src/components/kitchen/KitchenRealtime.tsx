"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function KitchenRealtime() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          // Sonido solo para pedidos nuevos
          if (payload.eventType === "INSERT") {
            const audio = new Audio("/sounds/new-order.mp3");

            audio.play().catch(() => {
              // Algunos navegadores bloquean el autoplay
            });
          }

          // Refrescar los datos del tablero
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
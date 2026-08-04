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
          console.log("Realtime:", payload);

          // Solo reproducimos sonido cuando llega un pedido nuevo
          if (payload.eventType === "INSERT") {
            const audio = new Audio("/sounds/new-order.mp3");

            audio
              .play()
              .catch((err) =>
                console.warn(
                  "No se pudo reproducir el sonido:",
                  err
                )
              );
          }

          // Refrescar la página para volver a cargar los pedidos
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
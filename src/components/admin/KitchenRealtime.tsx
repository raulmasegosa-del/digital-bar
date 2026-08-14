"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

const POLL_INTERVAL_MS = 3000;

export default function KitchenRealtime() {
  const router = useRouter();
  const firstRealtimeEvent = useRef(true);

  useEffect(() => {
    let mounted = true;

    const refresh = () => {
      if (mounted && document.visibilityState === "visible") {
        router.refresh();
      }
    };

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          if (firstRealtimeEvent.current) {
            firstRealtimeEvent.current = false;
            refresh();
            return;
          }

          refresh();

          const audio = new Audio("/sounds/new-order.mp3");
          audio.play().catch(() => {
            // El navegador puede bloquear el autoplay.
          });
        }
      )
      .subscribe();

    // Respaldo: aunque Supabase Realtime no esté disponible en un terminal,
    // la pantalla comprueba periódicamente si han entrado nuevos pedidos.
    const interval = window.setInterval(refresh, POLL_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

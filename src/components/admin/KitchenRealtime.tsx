"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function KitchenRealtime() {
  const router = useRouter();
  const firstLoad = useRef(true);

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
        () => {
          // Evitar sonido al conectar por primera vez
          if (firstLoad.current) {
            firstLoad.current = false;
            return;
          }

          // Refrescar la página
          router.refresh();

          // Reproducir sonido
          const audio = new Audio("/sounds/new-order.mp3");
          audio.play().catch(() => {
            // El navegador puede bloquear el autoplay
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
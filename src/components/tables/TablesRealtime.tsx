"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { subscribeOrders } from "@/lib/realtime/orders";

export default function TablesRealtime() {
  const router = useRouter();

  useEffect(() => {
    const channel = subscribeOrders(() => {
      router.refresh();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [router]);

  return null;
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  subscribeOrders,
  unsubscribeOrders,
} from "@/lib/realtime/orders";

export default function TablesRealtime() {
  const router = useRouter();

  useEffect(() => {
    const channel = subscribeOrders(() => {
      router.refresh();
    });

    return () => {
      unsubscribeOrders(channel);
    };
  }, [router]);

  return null;
}
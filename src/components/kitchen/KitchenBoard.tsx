"use client";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { getOrders } from "@/lib/orders/getOrders";
import KitchenCard from "@/components/kitchen/KitchenCard";
import type { Order } from "@/types/orders";

function sortByCreatedAt(orders: Order[]) {
  return [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default function KitchenBoard({ restaurantId }: { restaurantId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const firstLoad = useRef(true);

  async function loadOrders(playSound = false) {
    const data = await getOrders(restaurantId);

    if (playSound && !firstLoad.current && data.length > orders.length) {
      new Audio("/sounds/notification.mp3").play().catch(() => {});
    }

    firstLoad.current = false;
    setOrders(data);
  }

  useEffect(() => {
    void loadOrders();

    const channel = supabase
      .channel(`kitchen-orders-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => void loadOrders(true)
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const pending = sortByCreatedAt(orders.filter((order) => order.status === "pending"));
  const preparing = sortByCreatedAt(orders.filter((order) => order.status === "preparing"));
  const ready = sortByCreatedAt(orders.filter((order) => order.status === "ready"));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <KitchenColumn title="🟡 Nuevos" orders={pending} />
      <KitchenColumn title="👨‍🍳 Preparando" orders={preparing} />
      <KitchenColumn title="🍽️ Listos" orders={ready} />
    </div>
  );
}

type ColumnProps = { title: string; orders: Order[] };

function KitchenColumn({ title, orders }: ColumnProps) {
  return (
    <section className="rounded-2xl bg-gray-50 p-4">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-gray-400">Sin pedidos</div>
        ) : (
          orders.map((order, index) => (
            <div key={order.id} className={index === 0 ? "animate-pulse" : ""}>
              <KitchenCard order={order} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

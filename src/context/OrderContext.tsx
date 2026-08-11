"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { OrderStatus } from "@/types/orders";
import { getOrder } from "@/lib/orders/getOrder";

export type ActiveOrderItem = {
  id: string;
  product_id: string | null;
  name: string | null;
  quantity: number;
  price: number;
  options: Array<{ optionName?: string; extraPrice?: number }>;
};

export type ActiveOrder = {
  id: string;
  table: string;
  status: OrderStatus;
  total: number;
  items: ActiveOrderItem[];
};

type OrderContextType = {
  order: ActiveOrder | null;
  setOrder: (order: ActiveOrder) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
};

const STORAGE_KEY = "digital-bar-order";
const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrderState] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    async function restoreOrder() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const localOrder = JSON.parse(saved) as ActiveOrder;
        const dbOrder = await getOrder(localOrder.id);

        if (dbOrder.status === "served" || dbOrder.status === "cancelled") {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setOrderState({
          id: dbOrder.id,
          table: dbOrder.table_number,
          status: dbOrder.status,
          total: Number(dbOrder.total ?? 0),
          items: (dbOrder.order_items ?? []).map((item: any) => ({
            id: item.id,
            product_id: item.product_id ?? null,
            name: item.name ?? "Producto",
            quantity: Number(item.quantity ?? 0),
            price: Number(item.price ?? 0),
            options: Array.isArray(item.options) ? item.options : [],
          })),
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    void restoreOrder();
  }, []);

  useEffect(() => {
    if (order) localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    else localStorage.removeItem(STORAGE_KEY);
  }, [order]);

  function setOrder(nextOrder: ActiveOrder) {
    setOrderState(nextOrder);
  }

  function updateStatus(status: OrderStatus) {
    setOrderState((current) => (current ? { ...current, status } : null));
  }

  function clearOrder() {
    setOrderState(null);
  }

  return <OrderContext.Provider value={{ order, setOrder, updateStatus, clearOrder }}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder debe usarse dentro de OrderProvider");
  return context;
}

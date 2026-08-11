"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { OrderStatus } from "@/types/orders";
import { getOrder } from "@/lib/orders/getOrder";
import { getCustomerActiveOrder } from "@/app/actions/getCustomerActiveOrder";

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
const TABLE_KEY = "digital-bar-table";
const OrderContext = createContext<OrderContextType | null>(null);

function toActiveOrder(dbOrder: any): ActiveOrder {
  return {
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
  };
}

type Props = { restaurantId: string; children: ReactNode };

export function OrderProvider({ restaurantId, children }: Props) {
  const [order, setOrderState] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    async function restoreOrder() {
      try {
        const params = new URLSearchParams(window.location.search);
        const table = params.get("mesa")?.trim()
          || params.get("table")?.trim()
          || params.get("tableNumber")?.trim()
          || localStorage.getItem(TABLE_KEY)?.trim()
          || "";

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const localOrder = JSON.parse(saved) as ActiveOrder;
            const dbOrder = await getOrder(localOrder.id);
            if (dbOrder.status === "served" || dbOrder.status === "cancelled") {
              localStorage.removeItem(STORAGE_KEY);
            } else {
              setOrderState(toActiveOrder(dbOrder));
              return;
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        if (!restaurantId || !table) return;
        const activeOrder = await getCustomerActiveOrder(restaurantId, table);
        if (!activeOrder) return;
        if (activeOrder.status === "served" || activeOrder.status === "cancelled") return;
        setOrderState(toActiveOrder(activeOrder));
      } catch (error) {
        console.error("No se pudo restaurar el pedido activo", error);
      }
    }

    void restoreOrder();
  }, [restaurantId]);

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

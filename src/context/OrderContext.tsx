"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getOrder } from "@/lib/orders/getOrder";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type ActiveOrder = {
  id: string;
  table: string;
  status: OrderStatus;
};

type OrderContextType = {
  order: ActiveOrder | null;
  setOrder: (order: ActiveOrder) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
};

const STORAGE_KEY = "digital-bar-order";

const OrderContext =
  createContext<OrderContextType | null>(null);

export function OrderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [order, setOrderState] =
    useState<ActiveOrder | null>(null);

  useEffect(() => {
    async function restoreOrder() {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      try {
        const localOrder: ActiveOrder =
          JSON.parse(saved);

        const dbOrder =
          await getOrder(localOrder.id);

        if (
          dbOrder.status === "served" ||
          dbOrder.status === "cancelled"
        ) {
          localStorage.removeItem(
            STORAGE_KEY
          );
          return;
        }

        setOrderState({
          id: dbOrder.id,
          table: dbOrder.table_number,
          status: dbOrder.status,
        });
      } catch {
        localStorage.removeItem(
          STORAGE_KEY
        );
      }
    }

    void restoreOrder();
  }, []);

  useEffect(() => {
    if (order) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(order)
      );
    } else {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
  }, [order]);

  function setOrder(
    order: ActiveOrder
  ) {
    setOrderState(order);
  }

  function updateStatus(
    status: OrderStatus
  ) {
    setOrderState((current) => {
      if (!current) return null;

      return {
        ...current,
        status,
      };
    });
  }

  function clearOrder() {
    setOrderState(null);
  }

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        updateStatus,
        clearOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context =
    useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrder debe usarse dentro de OrderProvider"
    );
  }

  return context;
}
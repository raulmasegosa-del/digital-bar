"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type TableContextType = { restaurant: string; table: string; setRestaurant: (restaurant: string) => void; setTable: (table: string) => void };
const TableContext = createContext<TableContextType | null>(null);
const TABLE_KEY = "digital-bar-table";
const RESTAURANT_KEY = "digital-bar-restaurant";

export function TableProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurantState] = useState("");
  const [table, setTableState] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mesa = params.get("mesa") ?? params.get("table") ?? params.get("tableNumber");
    const bar = params.get("bar") ?? params.get("restaurant") ?? params.get("restaurantSlug");
    const savedTable = window.localStorage.getItem(TABLE_KEY) ?? "";
    const savedRestaurant = window.localStorage.getItem(RESTAURANT_KEY) ?? "";
    const nextTable = mesa?.trim() || savedTable;
    const nextRestaurant = bar?.trim() || savedRestaurant;
    setTableState(nextTable);
    setRestaurantState(nextRestaurant);
    if (mesa?.trim()) window.localStorage.setItem(TABLE_KEY, mesa.trim());
    if (bar?.trim()) window.localStorage.setItem(RESTAURANT_KEY, bar.trim());
  }, []);

  function setTable(value: string) {
    setTableState(value);
    if (value.trim()) window.localStorage.setItem(TABLE_KEY, value.trim());
    else window.localStorage.removeItem(TABLE_KEY);
  }

  function setRestaurant(value: string) {
    setRestaurantState(value);
    if (value.trim()) window.localStorage.setItem(RESTAURANT_KEY, value.trim());
    else window.localStorage.removeItem(RESTAURANT_KEY);
  }

  return <TableContext.Provider value={{ restaurant, table, setRestaurant, setTable }}>{children}</TableContext.Provider>;
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTable debe usarse dentro de TableProvider");
  return context;
}

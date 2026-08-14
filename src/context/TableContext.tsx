"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createCustomerSession } from "@/app/actions/createCustomerSession";
import { validateCustomerSession } from "@/app/actions/validateCustomerSession";

type TableContextType = {
  restaurant: string;
  table: string;
  sessionToken: string;
  sessionError: string;
  setRestaurant: (restaurant: string) => void;
  setTable: (table: string) => void;
};

const TableContext = createContext<TableContextType | null>(null);
const TABLE_KEY = "digital-bar-table";
const RESTAURANT_KEY = "digital-bar-restaurant";
const SESSION_TOKEN_KEY = "digital-bar-session-token";
const SESSION_CLOSED_MESSAGE = "La sesión de esta mesa ha finalizado. Lee de nuevo el QR de la mesa para continuar.";

export function TableProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurantState] = useState("");
  const [table, setTableState] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      const mesa = params.get("mesa") ?? params.get("table") ?? params.get("tableNumber");
      const tokenFromUrl = params.get("token")?.trim() ?? "";
      const barFromUrl = params.get("bar") ?? params.get("restaurant") ?? params.get("restaurantSlug");
      const pathnameMatch = window.location.pathname.match(/^\/r\/([^/]+)/);
      const restaurantSlug = barFromUrl?.trim() || pathnameMatch?.[1] || "";
      const savedTable = window.localStorage.getItem(TABLE_KEY) ?? "";
      const savedRestaurant = window.localStorage.getItem(RESTAURANT_KEY) ?? "";

      const hasQrTable = Boolean(mesa?.trim());
      const nextTable = mesa?.trim() || savedTable;
      const nextRestaurant = restaurantSlug || savedRestaurant;

      if (!active) return;
      setTableState(nextTable);
      setRestaurantState(nextRestaurant);
      setSessionError("");

      if (mesa?.trim()) window.localStorage.setItem(TABLE_KEY, mesa.trim());
      if (nextRestaurant) window.localStorage.setItem(RESTAURANT_KEY, nextRestaurant);

      if (!nextTable || !nextRestaurant) return;

      try {
        if (tokenFromUrl) {
          const session = await createCustomerSession({
            slug: nextRestaurant,
            table: nextTable,
            token: tokenFromUrl,
          });

          if (!active) return;
          setSessionToken(session.token);
          window.localStorage.setItem(SESSION_TOKEN_KEY, session.token);

          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set("mesa", nextTable);
          nextUrl.searchParams.set("token", session.token);
          window.history.replaceState({}, "", nextUrl.toString());
          return;
        }

        if (!hasQrTable) return;

        const session = await createCustomerSession({ slug: nextRestaurant, table: nextTable });
        if (!active) return;

        setSessionToken(session.token);
        window.localStorage.setItem(SESSION_TOKEN_KEY, session.token);

        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("mesa", nextTable);
        nextUrl.searchParams.set("token", session.token);
        nextUrl.searchParams.delete("bar");
        nextUrl.searchParams.delete("restaurant");
        nextUrl.searchParams.delete("restaurantSlug");
        window.history.replaceState({}, "", nextUrl.toString());
      } catch (error) {
        console.error("No se pudo inicializar la sesión de la mesa", error);
        if (active) {
          setSessionToken("");
          window.localStorage.removeItem(SESSION_TOKEN_KEY);
          setSessionError(error instanceof Error ? error.message : "No se ha podido abrir la sesión de la mesa.");
        }
      }
    };

    void initialize();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionToken || !restaurant || !table) return;

    let active = true;
    const checkSession = async () => {
      try {
        const result = await validateCustomerSession({
          slug: restaurant,
          table,
          token: sessionToken,
        });

        if (!active || result.valid) return;

        setSessionToken("");
        window.localStorage.removeItem(SESSION_TOKEN_KEY);
        setSessionError(SESSION_CLOSED_MESSAGE);
      } catch (error) {
        console.error("No se pudo comprobar el estado de la sesión", error);
      }
    };

    void checkSession();
    const interval = window.setInterval(() => void checkSession(), 3000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [restaurant, table, sessionToken]);

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

  return (
    <TableContext.Provider
      value={{ restaurant, table, sessionToken, sessionError, setRestaurant, setTable }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTable debe usarse dentro de TableProvider");
  return context;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type TableContextType = {
  restaurant: string;
  table: string;
  setRestaurant: (
    restaurant: string
  ) => void;
  setTable: (
    table: string
  ) => void;
};

const TableContext =
  createContext<TableContextType | null>(
    null
  );

const TABLE_KEY =
  "digital-bar-table";

const RESTAURANT_KEY =
  "digital-bar-restaurant";

export function TableProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    restaurant,
    setRestaurantState,
  ] = useState("");

  const [table, setTableState] =  useState("");

  useEffect(() => {
  const params = new URLSearchParams(
    window.location.search
  );

  const mesa = params.get("mesa");
  const bar = params.get("bar");

  if (mesa) {
    setTableState(mesa);
  } else {
    setTableState("");
  }

  if (bar) {
    setRestaurantState(bar);
  } else {
    setRestaurantState("");
  }
}, []);

  function setTable(
    value: string
  ) {
    setTableState(value);

    localStorage.setItem(
      TABLE_KEY,
      value
    );
  }

  function setRestaurant(
    value: string
  ) {
    setRestaurantState(value);

    localStorage.setItem(
      RESTAURANT_KEY,
      value
    );
  }

  return (
    <TableContext.Provider
      value={{
        restaurant,
        table,
        setRestaurant,
        setTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context =
    useContext(TableContext);

  if (!context) {
    throw new Error(
      "useTable debe usarse dentro de TableProvider"
    );
  }

  return context;
}
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type TableContextType = {
  table: string;
  setTable: (table: string) => void;
};

const TableContext =
  createContext<TableContextType | null>(null);

export function TableProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [table, setTable] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const mesa = params.get("mesa");

    if (mesa) {
      setTable(mesa);
    }
  }, []);

  return (
    <TableContext.Provider
      value={{
        table,
        setTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error(
      "useTable debe usarse dentro de TableProvider"
    );
  }

  return context;
}
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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
  createContext<TableContextType | null>(null);



export function TableProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [restaurant, setRestaurant] =
    useState("");


  const [table, setTable] =
    useState("");



  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const mesa =
      params.get("mesa");


    const bar =
      params.get("bar");



    if (mesa) {

      setTable(mesa);

      localStorage.setItem(
        "digital-bar-table",
        mesa
      );

    }



    if (bar) {

      setRestaurant(bar);

      localStorage.setItem(
        "digital-bar-restaurant",
        bar
      );

    }



    if (!mesa) {

      const savedTable =
        localStorage.getItem(
          "digital-bar-table"
        );


      if(savedTable){
        setTable(savedTable);
      }

    }



    if (!bar) {

      const savedRestaurant =
        localStorage.getItem(
          "digital-bar-restaurant"
        );


      if(savedRestaurant){
        setRestaurant(
          savedRestaurant
        );
      }

    }


  }, []);



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




export function useTable(){

  const context =
    useContext(TableContext);



  if(!context){

    throw new Error(
      "useTable debe usarse dentro de TableProvider"
    );

  }


  return context;

}
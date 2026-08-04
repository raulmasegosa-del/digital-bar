"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartOption = {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  extraPrice: number;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  options: CartOption[];
};

type CartContextType = {
  items: CartItem[];

  notes: string;
  setNotes: (value: string) => void;

  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  increaseQuantity: (index: number) => void;
  decreaseQuantity: (index: number) => void;
  clearCart: () => void;

  totalItems: number;
  total: number;
};

const CartContext =
  createContext<CartContextType | null>(null);


function sameOptions(
  first: CartOption[],
  second: CartOption[]
) {
  if (first.length !== second.length) {
    return false;
  }

  const firstSorted = [...first].sort((a, b) =>
    a.optionId.localeCompare(b.optionId)
  );

  const secondSorted = [...second].sort((a, b) =>
    a.optionId.localeCompare(b.optionId)
  );

  return firstSorted.every(
    (option, index) =>
      option.optionId ===
      secondSorted[index]?.optionId
  );
}


export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved =
      localStorage.getItem(
        "digital-bar-cart"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });


  const [notes, setNotes] = useState("");


  useEffect(() => {
    localStorage.setItem(
      "digital-bar-cart",
      JSON.stringify(items)
    );
  }, [items]);


  function addItem(item: CartItem) {

    setItems((current) => {

      const index = current.findIndex(
        (existing) =>
          existing.productId ===
            item.productId &&
          sameOptions(
            existing.options,
            item.options
          )
      );


      if (index === -1) {
        return [
          ...current,
          item,
        ];
      }


      const updated = [
        ...current,
      ];


      updated[index] = {
        ...updated[index],
        quantity:
          updated[index].quantity +
          item.quantity,
      };


      return updated;
    });
  }



  function increaseQuantity(
    index:number
  ) {

    setItems((current)=>
      current.map(
        (item,i)=>
          i === index
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }



  function decreaseQuantity(
    index:number
  ) {

    setItems((current)=>
      current.flatMap(
        (item,i)=>{

          if(i !== index){
            return item;
          }


          if(item.quantity <= 1){
            return [];
          }


          return {
            ...item,
            quantity:
              item.quantity - 1,
          };

        }
      )
    );
  }



  function removeItem(
    index:number
  ){

    setItems((current)=>
      current.filter(
        (_,i)=>i !== index
      )
    );

  }



  function clearCart(){

    setItems([]);

    setNotes("");

    localStorage.removeItem(
      "digital-bar-cart"
    );
  }



  const totalItems = useMemo(
    ()=> 
      items.reduce(
        (sum,item)=>
          sum + item.quantity,
        0
      ),
    [items]
  );



  const total = useMemo(
    ()=>{

      return items.reduce(
        (sum,item)=>{

          const extras =
            item.options.reduce(
              (extra,option)=>
                extra +
                option.extraPrice,
              0
            );


          return (
            sum +
            (
              item.price +
              extras
            ) *
            item.quantity
          );

        },
        0
      );

    },
    [items]
  );



  return (
    <CartContext.Provider
      value={{
        items,

        notes,
        setNotes,

        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,

        totalItems,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );

}



export function useCart(){

  const context =
    useContext(CartContext);


  if(!context){

    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );

  }


  return context;

}
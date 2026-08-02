"use client";

import {
  createContext,
  useContext,
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
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  total: number;
};

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: CartItem) {
  setItems((current) => {
    const index = current.findIndex((existing) => {
      if (existing.productId !== item.productId) {
        return false;
      }

      if (
        existing.options.length !== item.options.length
      ) {
        return false;
      }

      return existing.options.every(
        (option, i) =>
          option.optionId === item.options[i]?.optionId
      );
    });

    if (index === -1) {
      return [...current, item];
    }

    const updated = [...current];

    updated[index] = {
      ...updated[index],
      quantity:
        updated[index].quantity + item.quantity,
    };

    return updated;
  });
}

  function removeItem(index: number) {
    setItems((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [items]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const extras = item.options.reduce(
          (extra, option) =>
            extra + option.extraPrice,
          0
        );

        return (
          sum +
          (item.price + extras) * item.quantity
        );
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}
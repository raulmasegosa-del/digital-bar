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

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = "digital-bar-cart";

function sameOptions(first: CartOption[], second: CartOption[]) {
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
    (option, index) => option.optionId === secondSorted[index]?.optionId
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  // Hydrate the cart before allowing the persistence effect to write anything.
  // Without this guard, a full page load starts with [] and can immediately
  // overwrite the existing localStorage cart before the saved items are read.
  useEffect(() => {
    setLoadedStorageKey(null);

    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);

      if (!saved) {
        setItems([]);
      } else {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error restaurando el carrito", error);
      setItems([]);
    }

    setLoadedStorageKey(CART_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (loadedStorageKey !== CART_STORAGE_KEY) {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error guardando el carrito", error);
    }
  }, [items, loadedStorageKey]);

  function addItem(item: CartItem) {
    setItems((current) => {
      const index = current.findIndex(
        (existing) =>
          existing.productId === item.productId &&
          sameOptions(existing.options, item.options)
      );

      if (index === -1) {
        return [...current, item];
      }

      const updated = [...current];

      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + item.quantity,
      };

      return updated;
    });
  }

  function increaseQuantity(index: number) {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(index: number) {
    setItems((current) =>
      current.flatMap((item, i) => {
        if (i !== index) {
          return item;
        }

        if (item.quantity <= 1) {
          return [];
        }

        return {
          ...item,
          quantity: item.quantity - 1,
        };
      })
    );
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function clearCart() {
    setItems([]);
    setNotes("");

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error vaciando el carrito", error);
    }
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const extras = item.options.reduce(
        (extra, option) => extra + option.extraPrice,
        0
      );

      return sum + (item.price + extras) * item.quantity;
    }, 0);
  }, [items]);

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

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

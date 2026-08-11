"use client";

import { useState } from "react";

import Cart from "./cart/Cart";
import CartButton from "./CartButton";

import { useOrder } from "@/context/OrderContext";

type Props = {
  restaurantId: string;
};

export default function CartUI({ restaurantId }: Props) {
  const [open, setOpen] = useState(false);

  const { order } = useOrder();

  function handleOpen() {
    if (order) return;

    setOpen(true);
  }

  return (
    <>
      <CartButton
        onClick={handleOpen}
        disabled={!!order}
      />

      <Cart
        open={open}
        onClose={() => setOpen(false)}
        restaurantId={restaurantId}
      />
    </>
  );
}

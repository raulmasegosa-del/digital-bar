"use client";

import { useState } from "react";

import Cart from "./cart/Cart";
import CartButton from "./CartButton";

type Props = {
  restaurantId: string;
};

export default function CartUI({ restaurantId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CartButton
        onClick={() => setOpen(true)}
      />

      <Cart
        open={open}
        onClose={() => setOpen(false)}
        restaurantId={restaurantId}
      />
    </>
  );
}

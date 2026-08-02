"use client";

import { useState } from "react";
import Cart from "./Cart";
import CartButton from "./CartButton";

export default function CartUI() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CartButton
        onClick={() => setOpen(true)}
      />

      <Cart
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
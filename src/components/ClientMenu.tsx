"use client";

import { useState } from "react";
import Menu from "./Menu";
import Cart from "./Cart";
import CartButton from "./CartButton";

export default function ClientMenu() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Menu />

      <CartButton
        onClick={() => setCartOpen(true)}
      />

      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
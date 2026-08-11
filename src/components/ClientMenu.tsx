"use client";

import { useState } from "react";
import Menu from "./Menu";
import Cart from "./cart/Cart";
import CartButton from "./CartButton";

type Props = {
  restaurantId?: string;
};

export default function ClientMenu({ restaurantId }: Props) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Menu />

      <CartButton
        onClick={() => setCartOpen(true)}
      />

      {restaurantId ? (
        <Cart
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          restaurantId={restaurantId}
        />
      ) : null}
    </>
  );
}

"use client";

import { useState } from "react";
import Cart from "./cart/Cart";
import CartButton from "./CartButton";
import { useTable } from "@/context/TableContext";

export default function CartUI() {

  const [open, setOpen] =
    useState(false);

  const { table } =
    useTable();


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
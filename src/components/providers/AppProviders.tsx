"use client";

import type { ReactNode } from "react";

import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";
import { SettingsProvider } from "@/context/SettingsContext";

import type { RestaurantSettings } from "@/types/settings";

type Props = {
  settings: RestaurantSettings;
  children: ReactNode;
};

import { ToastProvider } from "@/context/ToastContext";

export default function AppProviders({
  settings,
  children,
}: Props) {
  return (
    <ToastProvider>
      <SettingsProvider settings={settings}>
        <CartProvider>
          <TableProvider>
            {children}
          </TableProvider>
        </CartProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
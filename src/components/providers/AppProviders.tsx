"use client";

import type { ReactNode } from "react";
import { OrderProvider } from "@/context/OrderContext";
import { ToastProvider } from "@/context/ToastContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";

import type { RestaurantSettings } from "@/types/settings";

type Props = {
  settings: RestaurantSettings;
  children: ReactNode;
};

export default function AppProviders({ settings, children }: Props) {
  return (
    <ToastProvider>
      <SettingsProvider settings={settings}>
        <OrderProvider restaurantId={settings.id}>
          <CartProvider>
            <TableProvider>{children}</TableProvider>
          </CartProvider>
        </OrderProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

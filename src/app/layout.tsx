import "./globals.css";
import type { Metadata } from "next";

import { CartProvider } from "@/context/CartContext";
import { TableProvider } from "@/context/TableContext";

export const metadata: Metadata = {
  title: "Digital Bar",
  description: "Carta digital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TableProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </TableProvider>
      </body>
    </html>
  );
}
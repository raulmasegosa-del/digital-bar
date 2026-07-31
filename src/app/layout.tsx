import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
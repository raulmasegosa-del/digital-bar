import "./globals.css";
import type { Metadata } from "next";

import AppProviders from "@/components/providers/AppProviders";
import { getRestaurantSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Digital Bar",
  description: "Carta digital",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getRestaurantSettings();

  return (
    <html lang="es">
      <body>
        <AppProviders settings={settings}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
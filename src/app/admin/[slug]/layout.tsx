import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { BarChart3, ClipboardList, Folder, QrCode, Settings, ShoppingBag, SlidersHorizontal, Table2 } from "lucide-react";

import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = { children: ReactNode; params: Promise<{ slug: string }> };

type NavigationItem = { href: string; label: string; icon: "dashboard" | "products" | "categories" | "options" | "orders" | "tables" | "qr" | "settings" };

export default async function AdminLayout({ children, params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const navigation: NavigationItem[] = [
    { href: `/admin/${slug}`, label: "Dashboard", icon: "dashboard" },
    { href: `/admin/${slug}/products`, label: "Productos", icon: "products" },
    { href: `/admin/${slug}/categories`, label: "Categorías", icon: "categories" },
    { href: `/admin/${slug}/options`, label: "Opciones", icon: "options" },
    { href: `/admin/${slug}/orders`, label: "Pedidos", icon: "orders" },
    { href: `/admin/${slug}/tables`, label: "Mesas", icon: "tables" },
    { href: `/admin/${slug}/qr`, label: "QR", icon: "qr" },
    { href: `/admin/${slug}/settings`, label: "Ajustes", icon: "settings" },
  ];

  return <AdminLayoutShell restaurant={{ name: restaurant.name, slug: restaurant.slug }} navigation={navigation}>{children}</AdminLayoutShell>;
}

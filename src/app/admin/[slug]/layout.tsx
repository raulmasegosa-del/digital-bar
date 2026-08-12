import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import {
  BarChart3,
  ClipboardList,
  Folder,
  QrCode,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Table2,
} from "lucide-react";

import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const navigation = [
    { href: `/admin/${slug}`, label: "Dashboard", icon: BarChart3 },
    { href: `/admin/${slug}/products`, label: "Productos", icon: ShoppingBag },
    { href: `/admin/${slug}/categories`, label: "Categorías", icon: Folder },
    { href: `/admin/${slug}/options`, label: "Opciones", icon: SlidersHorizontal },
    { href: `/admin/${slug}/orders`, label: "Pedidos", icon: ClipboardList },
    { href: `/admin/${slug}/tables`, label: "Mesas", icon: Table2 },
    { href: `/admin/${slug}/qr`, label: "QR", icon: QrCode },
    { href: `/admin/${slug}/settings`, label: "Ajustes", icon: Settings },
  ];

  return (
    <AdminLayoutShell
      restaurant={{ name: restaurant.name, slug: restaurant.slug }}
      navigation={navigation}
    >
      {children}
    </AdminLayoutShell>
  );
}

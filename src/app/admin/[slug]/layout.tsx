import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const navigation = [
    {
      href: `/admin/${slug}`,
      label: "📊 Dashboard",
    },
    {
      href: `/admin/${slug}/products`,
      label: "🍔 Productos",
    },
    {
      href: `/admin/${slug}/categories`,
      label: "📂 Categorías",
    },
    {
      href: `/admin/${slug}/options`,
      label: "⚙️ Opciones",
    },
    {
      href: `/admin/${slug}/orders`,
      label: "📋 Pedidos",
    },
    {
      href: `/admin/${slug}/tables`,
      label: "🪑 Mesas",
    },
    {
      href: `/admin/${slug}/qr`,
      label: "📱 QR",
    },
    {
      href: `/admin/${slug}/settings`,
      label: "⚙️ Ajustes",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r bg-white lg:block">
          <div className="border-b p-6">
            <h1 className="text-2xl font-bold text-amber-700">
              🍻 {restaurant.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Panel de administración
            </p>
          </div>

          <nav className="space-y-2 p-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  block
                  rounded-xl
                  px-4
                  py-3
                  transition
                  hover:bg-amber-50
                  hover:text-amber-700
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b bg-white">
            <div className="flex items-center justify-between px-8 py-5">
              <div>
                <h2 className="text-2xl font-bold">
                  {restaurant.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {restaurant.slug}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/super/restaurants"
                  className="rounded-xl border px-5 py-2 transition hover:bg-gray-50"
                >
                  ← Super Admin
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
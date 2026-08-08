import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

const navigation = [
  {
    href: "/super",
    label: "📊 Dashboard",
  },
  {
    href: "/super/restaurants",
    label: "🍽 Restaurantes",
  },
  {
    href: "/super/users",
    label: "👥 Usuarios",
  },
  {
    href: "/super/imports",
    label: "📥 Importaciones",
  },
  {
    href: "/super/settings",
    label: "⚙ Sistema",
  },
];

export default function AdminLayout({
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r bg-white lg:block">
          <div className="border-b p-6">
            <h1 className="text-2xl font-bold text-amber-700">
              🍻 Digital Bar Platform
            </h1>

            <p className="mt-1 text-sm text-gray-500">
Administración
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
                  Súper Administración
                </h2>

                <p className="text-sm text-gray-500">
                  Gestión Global
                </p>
              </div>

              <Link
                href="/"
                className="rounded-xl border px-5 py-2 transition hover:bg-gray-50"
              >
                Ir al Admin
              </Link>
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
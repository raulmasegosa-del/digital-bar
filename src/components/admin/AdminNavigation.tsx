"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  BookOpen,
  Settings,
  MonitorSmartphone,
  LucideIcon,
} from "lucide-react";

type Module = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const modules: Module[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Mesas",
    href: "/admin/tables",
    icon: UtensilsCrossed,
  },

  {
  title: "Cocina",
  href: "/cocina",
  icon: ChefHat,
},
  {
    title: "Carta",
    href: "/admin/products",
    icon: BookOpen,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {modules.map((module) => {
        const Icon = module.icon;

        const active =
          pathname === module.href;

        return (
          <Link
            key={module.href}
            href={module.href}
            className={`
              rounded-2xl
              border
              p-4
              transition-all
              duration-300
              hover:-translate-y-1
              ${
                active
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-100 bg-white hover:bg-gray-50"
              }
            `}
          >
            <Icon className="h-8 w-8 text-amber-600" />

            <h2 className="mt-3 font-semibold text-gray-900">
              {module.title}
            </h2>
          </Link>
        );
      })}

      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-gray-300
          bg-gray-50
          p-4
          opacity-70
        "
      >
        <MonitorSmartphone className="h-8 w-8 text-gray-500" />

        <h2 className="mt-3 font-semibold text-gray-900">
          Promoción TV
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Próximamente
        </p>
      </div>
    </nav>
  );
}
"use client";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  House,
  Palette,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function SidebarLink({
  href,
  children,
}: Props) {
  const pathname = usePathname();

  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  let Icon = House;

  switch (href) {
    case "/admin":
      Icon = UtensilsCrossed;
      break;

    case "/admin/categories":
      Icon = FolderOpen;
      break;

    case "/admin/appearance":
      Icon = Palette;
      break;

    case "/admin/qr":
      Icon = QrCode;
      break;

    case "/":
      Icon = House;
      break;
  }

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-xl px-4 py-3
        transition-all duration-200
        ${
          active
            ? "bg-amber-100 text-amber-700 font-semibold"
            : "text-gray-700 hover:bg-amber-50"
        }
      `}
    >
      <Icon
        size={20}
        className={active ? "text-amber-600" : "text-gray-500"}
      />

      <span>{children}</span>
    </Link>
  );
}
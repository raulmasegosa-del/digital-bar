"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BarChart3, ClipboardList, Folder, Menu, QrCode, Settings, ShoppingBag, SlidersHorizontal, Table2, Utensils, WalletCards, FileText } from "lucide-react";

type NavigationItem = { href: string; label: string; icon: "dashboard" | "products" | "categories" | "options" | "orders" | "tables" | "qr" | "settings" | "cash" | "reports" };
type Props = { children: ReactNode; restaurant: { name: string; slug: string }; navigation: NavigationItem[] };
const icons = { dashboard: BarChart3, products: ShoppingBag, categories: Folder, options: SlidersHorizontal, orders: ClipboardList, tables: Table2, qr: QrCode, settings: Settings, cash: WalletCards, reports: FileText };

export default function AdminLayoutShell({ children, restaurant, navigation }: Props) {
  const pathname = usePathname();
  const isOrdersScreen = pathname.endsWith("/orders");
  const isTablesScreen = pathname.endsWith("/tables");
  const isFocusedWorkspace = isOrdersScreen || isTablesScreen;

  if (isFocusedWorkspace) return (
    <div className="min-h-screen bg-[#0d0c0b] text-white">
      <div className="border-b border-zinc-800/80 bg-[#11100f] px-3 py-3 sm:px-5 lg:px-7">
        <Link href={`/admin/${restaurant.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#181716] px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400">
          <ArrowLeft size={16} strokeWidth={1.8}/><span>Volver al Dashboard</span>
        </Link>
      </div>
      {children}
    </div>
  );

  return <main className="min-h-screen bg-[#11100f] text-white"><div className="flex min-h-screen"><aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-[#141311]"><div className="border-b border-zinc-800 px-6 py-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400"><Utensils size={20} strokeWidth={1.8}/></div><div><div className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-500">Digital Bar</div><div className="mt-1 text-sm font-medium text-white">{restaurant.name}</div></div></div><p className="mt-4 text-xs text-zinc-500">Panel de administración</p></div><nav className="flex-1 px-3 py-6"><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">Administración</p><div className="space-y-1">{navigation.map((item) => { const Icon = icons[item.icon]; const active = pathname === item.href || (item.href !== `/admin/${restaurant.slug}` && pathname.startsWith(item.href)); return <Link key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${active ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400"}`}><Icon size={18} strokeWidth={1.8} className={active ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-400"}/><span>{item.label}</span></Link>; })}</div></nav><div className="border-t border-zinc-800 p-5"><div className="flex items-center justify-between"><div><p className="text-xs text-zinc-500">Restaurante</p><p className="mt-1 text-sm font-medium text-zinc-300">{restaurant.slug}</p></div><div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"/></div></div></aside><div className="flex min-w-0 flex-1 flex-col"><header className="border-b border-zinc-800 bg-[#11100f]"><div className="flex min-h-24 items-center justify-between px-8 lg:px-10"><div><div className="flex items-center gap-3"><h2 className="text-xl font-semibold tracking-tight text-white">{restaurant.name}</h2><span className="hidden rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 sm:inline-flex">Activo</span></div><p className="mt-1 text-xs text-zinc-500">{restaurant.slug}</p></div><Link href="/super/restaurants" className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400"><Menu size={16}/><span className="hidden sm:inline">Super Admin</span></Link></div></header><div className="flex-1">{children}</div></div></div></main>;
}

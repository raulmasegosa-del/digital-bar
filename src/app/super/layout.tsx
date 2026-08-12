import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Store } from "lucide-react";

type Props = { children: ReactNode };

const navigation = [
  { href: "/super", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super/restaurants", label: "Restaurantes", icon: Store },
];

export default function SuperLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-[#121110] lg:block">
          <div className="border-b border-zinc-800 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-400">✦</div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Digital Bar</p>
                <h1 className="mt-1 text-base font-semibold text-white">Super Admin</h1>
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-600">Gestión global de la plataforma</p>
          </div>

          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                >
                  <Icon size={17} strokeWidth={1.7} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-zinc-800 bg-[#121110]">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Super Administración</p>
                <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">Control global</h2>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#181716] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Producción</div>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}

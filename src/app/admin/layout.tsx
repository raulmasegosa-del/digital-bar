import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-amber-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="text-2xl font-bold text-amber-700"
          >
            Digital Bar Admin
          </Link>

          <Link
            href="/"
            className="rounded-lg border px-4 py-2 transition hover:bg-gray-100"
          >
            Ver menú
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6">
        {children}
      </div>
    </main>
  );
}
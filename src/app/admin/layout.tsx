import Image from "next/image";
import SidebarLink from "@/components/admin/SidebarLink";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="flex min-h-screen w-72 flex-col border-r border-amber-100 bg-white shadow-sm">
          {/* Logo */}
          <div className="border-b border-amber-100 p-6">
            <Image
              src="/logo.png"
              alt="Digital Bar"
              width={220}
              height={70}
              priority
              className="mx-auto h-auto"
            />

            <p className="mt-4 text-center text-sm text-gray-500">
              Panel de administración
            </p>
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-2 p-4">
            <SidebarLink href="/admin">
              Productos
            </SidebarLink>

            <SidebarLink href="/admin/categories">
              Categorías
            </SidebarLink>

            <SidebarLink href="/admin/appearance">
              Apariencia
            </SidebarLink>

            <SidebarLink href="/admin/qr">
              Código QR
            </SidebarLink>

            <div className="my-6 border-t border-amber-100" />

            <SidebarLink href="/">
              Ver carta
            </SidebarLink>
          </nav>

          {/* Footer */}
          <div className="border-t border-amber-100 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              DIGITAL BAR
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Versión 1.0 Beta
            </p>
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
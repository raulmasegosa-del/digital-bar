import Link from "next/link";

import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Panel de administración"
        description="Resumen general del restaurante."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="📋"
          title="Pedidos pendientes"
          value={3}
        />

        <StatCard
          icon="👨‍🍳"
          title="Preparando"
          value={2}
        />

        <StatCard
          icon="🍔"
          title="Productos"
          value={42}
        />

        <StatCard
          icon="📂"
          title="Categorías"
          value={8}
        />
      </section>

      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Accesos rápidos
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/orders"
            className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
          >
            📋 Pedidos
          </Link>

          <Link
            href="/admin/new"
            className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
          >
            ➕ Nuevo producto
          </Link>

          <Link
            href="/admin/settings"
            className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
          >
            ⚙️ Configuración
          </Link>

          <Link
            href="/admin/qr"
            className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
          >
            🖨️ QR
          </Link>
        </div>
      </section>
    </div>
  );
}
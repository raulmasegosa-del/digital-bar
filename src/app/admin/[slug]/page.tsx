import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminDashboardPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={restaurant.name}
        description="Panel de administración"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🍔 Productos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gestiona la carta del restaurante.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            📋 Pedidos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Consulta los pedidos en tiempo real.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🪑 Mesas
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gestiona las mesas del restaurante.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            ⚙️ Configuración
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Personaliza tu restaurante.
          </p>
        </div>
      </div>
    </>
  );
}
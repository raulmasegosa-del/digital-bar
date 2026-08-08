import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RestaurantPage({
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
        description={`Restaurante: ${restaurant.slug}`}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🍔 Carta
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gestiona categorías, productos y opciones.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            🪑 Mesas
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Configura las mesas del restaurante.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            📱 QR
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Genera y descarga los códigos QR.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            ⚙️ Configuración
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Personaliza este restaurante.
          </p>
        </div>
      </div>
    </>
  );
}
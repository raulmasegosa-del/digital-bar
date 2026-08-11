import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Ajustes"
        description={`Configura ${restaurant.name}.`}
      />

      <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Ajustes del restaurante
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          La configuración queda aislada por restaurante y preparada para completar sus opciones.
        </p>
      </div>
    </main>
  );
}

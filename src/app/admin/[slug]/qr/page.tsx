import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function QRPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  return (
    <main className="space-y-8">
      <PageHeader
        title="QR"
        description={`Gestiona los códigos QR de ${restaurant.name}.`}
      />

      <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Códigos QR
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          La sección está preparada para generar y gestionar los QR de este restaurante.
        </p>
      </div>
    </main>
  );
}

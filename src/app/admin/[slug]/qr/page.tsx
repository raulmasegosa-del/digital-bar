import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import QRGrid from "@/components/admin/qr/QRGrid";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function QRPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const tables = await getRestaurantTables(restaurant.id);

  return (
    <main className="space-y-8">
      <PageHeader
        title="QR"
        description={`Gestiona los códigos QR de ${restaurant.name}.`}
      />

      <QRGrid
        slug={slug}
        tables={tables.map((table) => ({
          number: table.number,
          name: table.name,
          zone: table.zone,
          qrToken: table.qr_token,
        }))}
      />
    </main>
  );
}

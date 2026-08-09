import Link from "next/link";
import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/form/PrimaryButton";
import OptionGroupGrid from "@/components/admin/OptionGroupGrid";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getOptionGroups } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OptionsPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  const groups = await getOptionGroups(
    restaurant.id
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Grupos de opciones"
        description="Gestiona los grupos de opciones disponibles para este restaurante."
      />

      <div className="flex justify-end">
        <Link
          href={`/admin/${slug}/options/new`}
        >
          <PrimaryButton>
            ➕ Nuevo grupo
          </PrimaryButton>
        </Link>
      </div>

      <OptionGroupGrid
        groups={groups}
        slug={slug}
      />
    </main>
  );
}
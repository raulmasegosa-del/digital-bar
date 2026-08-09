import OptionGroupCard from "./OptionGroupCard";

import type { AdminOptionGroup } from "@/types/admin";

type Props = {
  groups: AdminOptionGroup[];
  slug: string;
};

export default function OptionGroupGrid({
  groups,
  slug,
}: Props) {
  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow">
        <h2 className="text-xl font-semibold">
          Todavía no hay grupos de opciones.
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Pulsa en <strong>Nuevo grupo</strong> para crear el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <OptionGroupCard
          key={group.id}
          group={group}
          slug={slug}
        />
      ))}
    </div>
  );
}
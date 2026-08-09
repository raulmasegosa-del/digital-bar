import OptionItemCard from "./OptionItemCard";

import type { AdminOptionItem } from "@/types/admin";

type Props = {
  items: AdminOptionItem[];
  slug: string;
};

export default function OptionItemGrid({
  items,
  slug,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow">
        No hay opciones creadas.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <OptionItemCard
          key={item.id}
          item={item}
          slug={slug}
        />
      ))}
    </div>
  );
}
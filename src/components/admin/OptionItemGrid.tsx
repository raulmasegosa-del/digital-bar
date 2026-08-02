import { getOptionItems } from "@/lib/db/admin";
import OptionItemCard from "./OptionItemCard";

export default async function OptionItemGrid() {
  const items = await getOptionItems();

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
        />
      ))}
    </div>
  );
}
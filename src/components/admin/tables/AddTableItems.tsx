"use client";

import { useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { addTableItems } from "@/app/admin/[slug]/tables/[id]/actions";

type MenuItem = { id: string; name: string; prices?: Array<{ price: number | string; active?: boolean }> };
type Category = { id: string; name: string; items: MenuItem[] };

export default function AddTableItems({
  slug,
  restaurantId,
  tableId,
  categories,
}: {
  slug: string;
  restaurantId: string;
  tableId: string;
  categories: Category[];
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    if (!term) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLocaleLowerCase("es").includes(term)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, search]);

  const selected = categories.flatMap((category) => category.items).filter((item) => (quantities[item.id] ?? 0) > 0);
  const total = selected.reduce((sum, item) => {
    const price = Number(item.prices?.find((p) => p.active !== false)?.price ?? item.prices?.[0]?.price ?? 0);
    return sum + price * (quantities[item.id] ?? 0);
  }, 0);

  function change(id: string, delta: number) {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  }

  function submit() {
    startTransition(async () => {
      await addTableItems({
        slug,
        tableId,
        restaurantId,
        items: selected.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: quantities[item.id],
          price: Number(item.prices?.find((p) => p.active !== false)?.price ?? item.prices?.[0]?.price ?? 0),
        })),
      });
      setQuantities({});
      setSearch("");
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#181716] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Añadir consumición</h2>
          <p className="mt-1 text-sm text-zinc-500">Añade productos directamente a la cuenta de la mesa.</p>
        </div>
        {selected.length > 0 && (
          <button onClick={submit} disabled={isPending} className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
            {isPending ? "Añadiendo..." : `Añadir · ${total.toFixed(2)} €`}
          </button>
        )}
      </div>

      <div className="relative mt-5">
        <Search size={17} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar producto para añadir..."
          aria-label="Buscar producto para añadir"
          className="h-12 w-full rounded-xl border border-zinc-800 bg-[#11100f] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/50 focus:bg-[#151412]"
        />
      </div>

      <div className="mt-6 space-y-7">
        {filteredCategories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 px-5 py-10 text-center text-sm text-zinc-600">
            No se ha encontrado ningún producto.
          </div>
        ) : filteredCategories.map((category) => (
          <div key={category.id}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-500">{category.name}</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                const price = Number(item.prices?.find((p) => p.active !== false)?.price ?? item.prices?.[0]?.price ?? 0);
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500">{price.toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => change(item.id, -1)} disabled={!quantity} className="h-8 w-8 rounded-lg border border-zinc-700 text-zinc-300 disabled:opacity-30">−</button>
                      <span className="w-5 text-center text-sm text-white">{quantity}</span>
                      <button onClick={() => change(item.id, 1)} className="h-8 w-8 rounded-lg bg-amber-600 text-white">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

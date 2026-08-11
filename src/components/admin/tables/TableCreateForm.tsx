"use client";

import { useRef } from "react";
import { createTable } from "@/app/admin/[slug]/tables/actions";

export default function TableCreateForm({ restaurantId, slug }: { restaurantId: string; slug: string }) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createTable(restaurantId, slug, formData);
        ref.current?.reset();
      }}
      className="grid gap-4 rounded-2xl border border-zinc-800 bg-[#181716] p-6 md:grid-cols-4"
    >
      <input name="number" type="number" min="1" required placeholder="Número" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
      <input name="name" placeholder="Nombre (opcional)" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
      <input name="zone" placeholder="Zona (opcional)" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
      <button type="submit" className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">+ Añadir mesa</button>
    </form>
  );
}

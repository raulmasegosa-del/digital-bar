"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTableDescription } from "@/app/admin/[slug]/tables/actions";

export default function TableDescriptionForm({
  restaurantId,
  tableId,
  slug,
  initialDescription,
}: {
  restaurantId: string;
  tableId: string;
  slug: string;
  initialDescription: string;
}) {
  const [description, setDescription] = useState(initialDescription);
  const [saving, startSaving] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    startSaving(async () => {
      try {
        await saveTableDescription(restaurantId, slug, tableId, formData);
        setMessage("Descripción guardada.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se ha podido guardar la descripción.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="table-description" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Descripción de la mesa
          </label>
          <input
            id="table-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={120}
            placeholder="Ej.: cerca de la ventana, reserva, familia..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-zinc-400" role="status">{message}</p>}
    </form>
  );
}

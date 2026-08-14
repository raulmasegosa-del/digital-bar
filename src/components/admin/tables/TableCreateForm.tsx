"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addRestaurantTables, createTable } from "@/app/admin/[slug]/tables/actions";

export default function TableCreateForm({ restaurantId, slug }: { restaurantId: string; slug: string }) {
  const singleRef = useRef<HTMLFormElement>(null);
  const bulkRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "No se ha podido guardar la mesa.";
  }

  function submitSingle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startSaving(async () => {
      try {
        await createTable(restaurantId, slug, formData);
        singleRef.current?.reset();
        router.refresh();
      } catch (error) {
        setError(getErrorMessage(error));
      }
    });
  }

  function submitBulk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startSaving(async () => {
      try {
        await addRestaurantTables(restaurantId, slug, formData);
        bulkRef.current?.reset();
        router.refresh();
      } catch (error) {
        setError(getErrorMessage(error));
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form ref={singleRef} onSubmit={submitSingle} className="space-y-4 rounded-2xl border border-zinc-800 bg-[#181716] p-6">
        <div>
          <h2 className="font-semibold text-white">Añadir una mesa</h2>
          <p className="mt-1 text-sm text-zinc-500">Para añadir o completar mesas individualmente.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input name="number" type="number" min="1" required placeholder="Número" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
          <input name="name" placeholder="Nombre" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
          <input name="zone" placeholder="Zona" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white" />
        </div>
        <button type="submit" disabled={saving} className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Guardando..." : "+ Añadir mesa"}
        </button>
      </form>

      <form ref={bulkRef} onSubmit={submitBulk} className="space-y-4 rounded-2xl border border-zinc-800 bg-[#181716] p-6">
        <div>
          <h2 className="font-semibold text-white">Crear varias mesas</h2>
          <p className="mt-1 text-sm text-zinc-500">Crea automáticamente los números que todavía no existan.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input name="count" type="number" min="1" max="500" required defaultValue="10" placeholder="Cantidad" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white sm:max-w-40" />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input name="generateQr" type="checkbox" defaultChecked className="h-4 w-4" />
            Generar QR
          </label>
        </div>
        <button type="submit" disabled={saving} className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Guardando..." : "+ Crear mesas"}
        </button>
      </form>

      {error && (
        <div className="lg:col-span-2 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

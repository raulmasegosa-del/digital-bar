"use client";

import { useState, useTransition } from "react";

import { invalidateAvailableQrs } from "@/app/admin/[slug]/qr/actions";

type Props = {
  restaurantId: string;
  slug: string;
};

export default function InvalidateQrsButton({
  restaurantId,
  slug,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      "Se invalidarán los QR de las mesas que NO tengan pedidos activos. Las mesas con pedidos pendientes conservarán su QR. ¿Continuar?"
    );

    if (!confirmed) return;

    setMessage(null);

    startTransition(async () => {
      try {
        const result = await invalidateAvailableQrs(restaurantId, slug);

        if (result.protectedTables.length > 0) {
          setMessage(
            `QR actualizados en ${result.rotated} mesa(s). Se conservaron los QR de las mesas con pedidos activos: ${result.protectedTables.join(", ")}.`
          );
        } else {
          setMessage(`QR actualizados en ${result.rotated} mesa(s).`);
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron actualizar los QR."
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Actualizando QR…" : "🔄 Invalidar QR libres"}
      </button>
      {message && (
        <p className="max-w-md text-right text-xs text-zinc-400">{message}</p>
      )}
    </div>
  );
}

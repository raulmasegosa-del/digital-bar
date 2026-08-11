"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@/types/orders";
import { updateRestaurantOrderStatus } from "@/app/admin/[slug]/orders/actions";

type Props = { slug: string; orderId: string; status: OrderStatus };
type Action = { label: string; status: OrderStatus; tone: string };

const actionsByStatus: Partial<Record<OrderStatus, Action[]>> = {
  pending: [
    { label: "Preparando", status: "preparing", tone: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
  preparing: [
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
  ready: [
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
  served: [
    { label: "Preparando", status: "preparing", tone: "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/50 hover:bg-blue-500/15" },
    { label: "Recibido", status: "pending", tone: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/50 hover:bg-yellow-500/15" },
  ],
  bill: [
    { label: "Servido", status: "served", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/15" },
  ],
};

export default function RestaurantOrderActions({ slug, orderId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function changeStatus(nextStatus: OrderStatus) {
    startTransition(async () => {
      try {
        await updateRestaurantOrderStatus(slug, orderId, nextStatus);
        // Force a fresh server render. router.refresh() could preserve the
        // current RSC payload and leave the card visually in its old column.
        window.location.reload();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "No se pudo actualizar el pedido");
      }
    });
  }

  const actions = actionsByStatus[status] ?? [];
  const isClosed = status === "completed" || status === "cancelled";

  return (
    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
      {!isClosed && actions.map((action) => (
        <button key={action.status} type="button" disabled={isPending} onClick={() => changeStatus(action.status)} className={`min-h-10 rounded-lg border px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${action.tone}`}>
          {isPending ? "Actualizando…" : action.label}
        </button>
      ))}

      {!isClosed && (
        <button type="button" disabled={isPending} onClick={() => changeStatus("completed")} className="min-h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs font-bold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40">
          {isPending ? "Actualizando…" : "Pagado"}
        </button>
      )}

      {!isClosed && (
        <button type="button" disabled={isPending} onClick={() => changeStatus("cancelled")} className="min-h-10 rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40">
          {isPending ? "Actualizando…" : "Cancelar"}
        </button>
      )}
    </div>
  );
}

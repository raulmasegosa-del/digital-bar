"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/types/orders";
import { updateRestaurantOrderStatus } from "@/app/admin/[slug]/orders/actions";

type Props = {
  slug: string;
  orderId: string;
  status: OrderStatus;
};

const actions: Array<{
  status: OrderStatus;
  label: string;
}> = [
  { status: "pending", label: "Recibido" },
  { status: "preparing", label: "Preparando" },
  { status: "ready", label: "Listo" },
  { status: "served", label: "Servido" },
  { status: "completed", label: "Finalizar" },
];

export default function RestaurantOrderActions({
  slug,
  orderId,
  status,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function changeStatus(nextStatus: OrderStatus) {
    startTransition(async () => {
      try {
        await updateRestaurantOrderStatus(slug, orderId, nextStatus);
        router.refresh();
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el pedido"
        );
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          disabled={isPending || status === action.status}
          onClick={() => changeStatus(action.status)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
            status === action.status
              ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
              : "border-zinc-700 text-zinc-300 hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400"
          }`}
        >
          {action.label}
        </button>
      ))}

      <button
        type="button"
        disabled={isPending || status === "cancelled"}
        onClick={() => changeStatus("cancelled")}
        className="rounded-lg border border-red-900/60 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancelar
      </button>
    </div>
  );
}

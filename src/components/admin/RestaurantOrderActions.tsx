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

export default function RestaurantOrderActions({ slug, orderId, status }: Props) {
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

  const isClosed = status === "completed" || status === "cancelled";

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <button
        type="button"
        disabled={isPending || isClosed}
        onClick={() => changeStatus("completed")}
        className="min-h-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Finalizar
      </button>

      <button
        type="button"
        disabled={isPending || isClosed}
        onClick={() => changeStatus("cancelled")}
        className="min-h-10 rounded-lg border border-red-500/25 bg-red-500/5 px-5 py-2.5 text-xs font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancelar
      </button>
    </div>
  );
}

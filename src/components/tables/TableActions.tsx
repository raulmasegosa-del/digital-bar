import { updateTableStatus } from "@/lib/tables/updateTableStatus";

import type {
  OrderStatus,
  TableStatus,
} from "@/types/tables";

type Props = {
  orderId: string;
  status: TableStatus;
};

export default function TableActions({
  orderId,
  status,
}: Props) {
  async function changeStatus(
    newStatus: OrderStatus
  ) {
    "use server";

    await updateTableStatus(
      orderId,
      newStatus
    );
  }

  async function serve() {
    "use server";
    await changeStatus("served");
  }

  async function requestBill() {
    "use server";
    await changeStatus("bill");
  }

  async function complete() {
    "use server";
    await changeStatus("completed");
  }

  return (
    <div className="mt-8 space-y-3">
      {status === "preparing" && (
        <form action={serve}>
          <button
            className="
              w-full
              rounded-xl
              bg-green-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-green-700
            "
          >
            🟢 Servir pedido
          </button>
        </form>
      )}

      {status === "served" && (
        <form action={requestBill}>
          <button
            className="
              w-full
              rounded-xl
              bg-amber-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-amber-700
            "
          >
            💶 Solicitar cuenta
          </button>
        </form>
      )}

      {status === "bill" && (
        <form action={complete}>
          <button
            className="
              w-full
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            💳 Cobrar mesa
          </button>
        </form>
      )}
    </div>
  );
}
import { updateTableStatus } from "@/lib/tables/updateTableStatus";

import { TableStatus } from "@/types/tables";

type Props = {
  orderId: string;
  status: TableStatus;
};

export default function TableActions({
  orderId,
  status,
}: Props) {
  async function changeStatus(
    newStatus: TableStatus
  ) {
    "use server";

    await updateTableStatus(
      orderId,
      newStatus
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {status === "preparing" && (
        <form
          action={changeStatus.bind(
            null,
            "served"
          )}
        >
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
        <form
          action={changeStatus.bind(
            null,
            "bill"
          )}
        >
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
        <form
          action={changeStatus.bind(
            null,
            "completed"
          )}
        >
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
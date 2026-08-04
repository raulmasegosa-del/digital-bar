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
  if (status !== "preparing") {
    return null;
  }

  async function serve() {
    "use server";

    await updateTableStatus(
      orderId,
      "served"
    );
  }

  return (
    <form action={serve}>
      <button
        className="
          mt-8
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
  );
}
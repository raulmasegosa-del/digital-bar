import type { OrderStatus } from "@/types/orders";

type Params = {
  status: OrderStatus;
  showToast: (message: string) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
};

export function handleOrderStatus({
  status,
  showToast,
  updateStatus,
  clearOrder,
}: Params) {
  updateStatus(status);

  switch (status) {
    case "preparing":
      showToast(
        "👨‍🍳 La cocina está preparando tu pedido"
      );
      break;

    case "ready":
      showToast(
        "🍽️ ¡Tu pedido está listo!"
      );

      if (
        typeof window !== "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate([300, 150, 300]);
      }

      break;

    case "served":
      showToast("✅ Pedido servido");
      clearOrder();
      break;

    case "cancelled":
      showToast("❌ Pedido cancelado");
      clearOrder();
      break;
  }
}
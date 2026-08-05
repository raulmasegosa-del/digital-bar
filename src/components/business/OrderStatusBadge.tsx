import Badge from "@/components/ui/Badge";

import type { OrderStatus } from "@/types/orders";

type Props = {
  status: OrderStatus;
};

const config: Record<
  OrderStatus,
  {
    label: string;
    variant:
      | "warning"
      | "info"
      | "success"
      | "neutral"
      | "danger";
  }
> = {
  pending: {
    label: "🟡 Pendiente",
    variant: "warning",
  },

  preparing: {
    label: "👨‍🍳 Preparando",
    variant: "info",
  },

  ready: {
    label: "🍽️ Listo",
    variant: "success",
  },

  served: {
    label: "🍻 Servido",
    variant: "success",
  },

  completed: {
    label: "✅ Completado",
    variant: "neutral",
  },

  cancelled: {
    label: "❌ Cancelado",
    variant: "danger",
  },
};

export default function OrderStatusBadge({
  status,
}: Props) {
  const item = config[status];

  return (
    <Badge variant={item.variant}>
      {item.label}
    </Badge>
  );
}
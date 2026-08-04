export type OrderPriority =
  | "normal"
  | "warning"
  | "urgent";

export function getOrderPriority(
  createdAt: string
): OrderPriority {
  const minutes = Math.floor(
    (Date.now() -
      new Date(createdAt).getTime()) /
      60000
  );

  if (minutes >= 10) {
    return "urgent";
  }

  if (minutes >= 5) {
    return "warning";
  }

  return "normal";
}
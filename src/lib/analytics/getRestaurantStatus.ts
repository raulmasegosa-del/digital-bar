type Stats = {
  pending: number;
  preparing: number;
};

export function getRestaurantStatus(
  stats: Stats
) {
  if (stats.preparing >= 10) {
    return {
      status: "danger",
      title: "🔴 Cocina saturada",
      description:
        "Hay demasiados pedidos en preparación.",
    };
  }

  if (stats.pending >= 5) {
    return {
      status: "warning",
      title: "🟠 Muchos pedidos pendientes",
      description:
        "Conviene reforzar cocina.",
    };
  }

  return {
    status: "success",
    title:
      "🟢 Servicio bajo control",
    description:
      "Todo funciona correctamente.",
  };
}
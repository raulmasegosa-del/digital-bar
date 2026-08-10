import { supabaseAdmin } from "@/lib/supabase/server";

type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  totalRevenue: number;
};

export async function getRestaurantDashboard(
  restaurantId: string
) {
  // Pedidos del restaurante
  const { data: orders, error: ordersError } =
    await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId);

  if (ordersError) {
    throw ordersError;
  }

  const stats: DashboardStats = {
    totalOrders: orders.length,

    pendingOrders: orders.filter(
      (o) => o.status === "pending"
    ).length,

    preparingOrders: orders.filter(
      (o) => o.status === "preparing"
    ).length,

    completedOrders: orders.filter(
      (o) =>
        o.status === "completed" ||
        o.status === "served"
    ).length,

    totalRevenue: orders
      .filter(
        (o) =>
          o.status === "completed" ||
          o.status === "served"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total ?? 0),
        0
      ),
  };

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 10);

  // TODO:
  // Obtener productos más vendidos
  const topProducts: unknown[] = [];

  // TODO:
  // Calcular tiempo medio de preparación
  const averagePreparationTime = 0;

  // Mesas activas
  const activeTables = new Set(
    orders
      .filter(
        (o) =>
          o.status !== "completed" &&
          o.status !== "cancelled"
      )
      .map((o) => o.table_number)
  ).size;

  return {
    stats,
    recentOrders,
    topProducts,
    averagePreparationTime,
    activeTables,
  };
}
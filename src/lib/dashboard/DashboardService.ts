import { getDashboardStats } from "@/lib/analytics/dashboard";
import { getRecentOrders } from "@/lib/analytics/recentOrders";
import { getTopProducts } from "@/lib/analytics/topProducts";
import { getSalesByHour } from "@/lib/analytics/getSalesByHour";
import { getAveragePreparationTime } from "@/lib/analytics/getAveragePreparationTime";
import { getActiveTables } from "@/lib/analytics/getActiveTables";
import { getRestaurantStatus } from "@/lib/analytics/getRestaurantStatus";

export async function getDashboardData() {
  const [
    stats,
    recentOrders,
    topProducts,
    salesByHour,
    averagePreparationTime,
    activeTables,
  ] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getTopProducts(),
    getSalesByHour(),
    getAveragePreparationTime(),
    getActiveTables(),
  ]);

  const restaurantStatus =
    getRestaurantStatus(stats);

  return {
    stats,
    recentOrders,
    topProducts,
    salesByHour,
    averagePreparationTime,
    activeTables,
    restaurantStatus,
  };
}
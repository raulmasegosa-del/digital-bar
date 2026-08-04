import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardRealtime from "@/components/admin/dashboard/DashboardRealtime";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import KitchenMetrics from "@/components/admin/dashboard/KitchenMetrics";
import { getDashboardData } from "@/lib/dashboard/DashboardService";
import RestaurantStatus from "@/components/admin/dashboard/RestaurantStatus";
export default async function AdminPage() {
  const dashboard =
    await getDashboardData();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader />

        <DashboardRealtime />
<RestaurantStatus
  title={dashboard.restaurantStatus.title}
  description={dashboard.restaurantStatus.description}
  status={dashboard.restaurantStatus.status}
/>
        <StatsGrid
          stats={dashboard.stats}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <RecentOrders
            orders={dashboard.recentOrders}
          />

          <TopProducts
            products={dashboard.topProducts}
          />
          <KitchenMetrics
  averagePreparationTime={
    dashboard.averagePreparationTime
  }
  activeTables={
    dashboard.activeTables
  }
/>
        </div>
      </div>
    </main>
  );
}
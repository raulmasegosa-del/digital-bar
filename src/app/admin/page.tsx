import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardRealtime from "@/components/admin/dashboard/DashboardRealtime";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import KitchenMetrics from "@/components/admin/dashboard/KitchenMetrics";

import { getDashboardData } from "@/lib/dashboard/DashboardService";

export default async function AdminPage() {
  const dashboard =
    await getDashboardData();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <DashboardHeader />

        <DashboardRealtime />

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
        </div>

        <KitchenMetrics
          averagePreparationTime={
            dashboard.averagePreparationTime
          }
          activeTables={
            dashboard.activeTables
          }
        />

      </div>
    </main>
  );
}
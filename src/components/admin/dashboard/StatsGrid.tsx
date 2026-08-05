import {
  Wallet,
  ShoppingBag,
  Clock3,
  ChefHat,
  UtensilsCrossed,
  Receipt,
} from "lucide-react";

import StatCard from "./StatCard";

type Props = {
  stats: {
    sales: number;
    totalOrders: number;
    pending: number;
    preparing: number;
    ready: number;
    averageTicket: number;
  };
};

export default function StatsGrid({
  stats,
}: Props) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Ventas hoy"
        value={`${stats.sales.toFixed(2)} €`}
        icon={Wallet}
      />

      <StatCard
        title="Pedidos"
        value={stats.totalOrders}
        icon={ShoppingBag}
      />

      <StatCard
        title="Pendientes"
        value={stats.pending}
        icon={Clock3}
      />

      <StatCard
        title="Preparando"
        value={stats.preparing}
        icon={ChefHat}
      />

      <StatCard
        title="Listos"
        value={stats.ready}
        icon={UtensilsCrossed}
      />

      <StatCard
        title="Ticket medio"
        value={`${stats.averageTicket.toFixed(2)} €`}
        icon={Receipt}
      />
    </section>
  );
}
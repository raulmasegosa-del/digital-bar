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
        icon="💰"
      />

      <StatCard
        title="Pedidos"
        value={stats.totalOrders}
        icon="🍔"
      />

      <StatCard
        title="Pendientes"
        value={stats.pending}
        icon="🟡"
      />

      <StatCard
        title="Preparando"
        value={stats.preparing}
        icon="👨‍🍳"
      />

      <StatCard
        title="Listos"
        value={stats.ready}
        icon="🍽️"
      />

      <StatCard
        title="Ticket medio"
        value={`${stats.averageTicket.toFixed(2)} €`}
        icon="🧾"
      />
    </section>
  );
}
import PageHeader from "@/components/ui/PageHeader";

import KitchenBoard from "@/components/kitchen/KitchenBoard";
import ServiceCallsBoard from "@/components/service/ServiceCallsBoard";

export default function CocinaPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Cocina"
        description="Gestiona los pedidos en preparación."
        backHref="/admin"
        backLabel="Dashboard"
      />

      <ServiceCallsBoard />

      <KitchenBoard />
    </main>
  );
}
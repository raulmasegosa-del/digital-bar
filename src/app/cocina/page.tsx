import KitchenBoard from "@/components/kitchen/KitchenBoard";
import ServiceCallsBoard from "@/components/service/ServiceCallsBoard";

export default function CocinaPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-4xl font-bold">
          👨‍🍳 Cocina
        </h1>

        <ServiceCallsBoard />

        <KitchenBoard />
      </div>
    </main>
  );
}

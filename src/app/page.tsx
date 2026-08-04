import Header from "@/components/Header";
import CategoryNavigation from "@/components/CategoryNavigation";
import Menu from "@/components/Menu";
import CartUI from "@/components/CartUI";
import OrderRealtime from "@/components/order/OrderRealtime";

import WaiterActions from "@/components/waiter/WaiterActions";

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Header />

        <WaiterActions />

        <Menu />

        <CartUI />

        <OrderRealtime />
      </div>
    </main>
  );
}
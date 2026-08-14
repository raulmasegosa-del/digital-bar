import type { ReactNode } from "react";
import KitchenRealtime from "@/components/admin/KitchenRealtime";

type Props = { children: ReactNode };

export default function OrdersLayout({ children }: Props) {
  return (
    <>
      <KitchenRealtime />
      {children}
    </>
  );
}

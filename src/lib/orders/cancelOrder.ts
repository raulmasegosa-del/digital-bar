import { supabase } from "@/lib/supabase/client";

export async function cancelOrder(orderId: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    throw error;
  }
}

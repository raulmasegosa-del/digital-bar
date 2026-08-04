import { supabase } from "@/lib/supabase/client";

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  console.log("UPDATE ORDER:", orderId, status);

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}
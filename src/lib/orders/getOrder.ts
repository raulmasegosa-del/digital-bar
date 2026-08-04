import { supabase } from "@/lib/supabase/client";

export async function getOrder(
  orderId: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
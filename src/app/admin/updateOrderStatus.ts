import { supabase } from "@/lib/supabase/client";

export async function updateOrderStatus(
  orderId: string,
  status: string
) {

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", orderId)
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;
}
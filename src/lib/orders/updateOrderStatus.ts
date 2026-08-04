import { supabase } from "@/lib/supabase";

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
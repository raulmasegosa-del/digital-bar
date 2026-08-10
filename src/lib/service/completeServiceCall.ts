import { supabaseClient } from "@/lib/supabase/client";

export async function completeServiceCall(
  id: string
): Promise<void> {
  const { error } = await supabaseClient
    .from("service_calls")
    .update({
      status: "done",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
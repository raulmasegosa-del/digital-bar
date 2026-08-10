import { supabase } from "@/lib/supabase/client";

export async function completeServiceCall(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("service_calls")
    .update({
      status: "done",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
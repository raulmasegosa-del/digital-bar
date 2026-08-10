import { supabase } from "@/lib/supabase/client";

export async function createServiceCall({
  table,
  type,
}: {
  table: string;
  type: "waiter" | "bill";
}) {
  const { error } = await supabase
    .from("service_calls")
    .insert({
      table_number: table,
      type,
    });

  if (error) {
    throw error;
  }
}
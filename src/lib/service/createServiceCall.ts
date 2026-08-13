import { supabase } from "@/lib/supabase/client";

export async function createServiceCall({
  table,
  type,
}: {
  table: string;
  type: "waiter" | "bill";
}) {
  const tableNumber = table.trim();

  if (!tableNumber) {
    throw new Error("No se ha identificado la mesa.");
  }

  const { error } = await supabase
    .from("service_calls")
    .insert({
      table_number: tableNumber,
      type,
      status: "pending",
    });

  if (error) {
    throw error;
  }
}

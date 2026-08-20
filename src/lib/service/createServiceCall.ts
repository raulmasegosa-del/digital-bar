import { supabase } from "@/lib/supabase/client";

export async function createServiceCall({
  table,
  type,
  restaurantId,
  description,
}: {
  table: string;
  type: "waiter" | "bill";
  restaurantId: string;
  description?: string;
}) {
  const tableNumber = table.trim();

  if (!tableNumber) {
    throw new Error("No se ha identificado la mesa.");
  }
  if (!restaurantId) {
    throw new Error("No se ha identificado el restaurante.");
  }

  const { error } = await supabase
    .from("service_calls")
    .insert({
      table_number: tableNumber,
      type,
      status: "pending",
      restaurant_id: restaurantId,
      description: description?.trim() || null,
    });

  if (error) throw error;
}

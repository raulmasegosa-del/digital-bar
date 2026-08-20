import { supabase } from "@/lib/supabase/client";

export async function createServiceCall({
  restaurantId,
  table,
  type,
  description = "",
}: {
  restaurantId: string;
  table: string;
  type: "waiter" | "bill";
  description?: string;
}) {
  if (!restaurantId) throw new Error("No se ha identificado el restaurante.");

  const { error } = await supabase
    .from("service_calls")
    .insert({
      restaurant_id: restaurantId,
      table_number: table,
      type,
      description: description.trim() || null,
      status: "pending",
    });

  if (error) throw error;
}

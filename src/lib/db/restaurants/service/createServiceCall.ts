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

  const cleanDescription = description.trim();

  // Las nuevas peticiones del camarero se acumulan en un único aviso pendiente
  // de la mesa, separando cada nota en un párrafo. Una petición sin texto sigue
  // funcionando y no borra las notas anteriores.
  if (type === "waiter") {
    const { data: existing, error: existingError } = await supabase
      .from("service_calls")
      .select("id, description")
      .eq("restaurant_id", restaurantId)
      .eq("table_number", table)
      .eq("type", "waiter")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      if (cleanDescription) {
        const previous = String(existing.description ?? "").trim();
        const nextDescription = previous
          ? `${previous}\n\n${cleanDescription}`
          : cleanDescription;
        const { error } = await supabase
          .from("service_calls")
          .update({ description: nextDescription })
          .eq("id", existing.id);
        if (error) throw error;
      }
      return;
    }
  }

  const { error } = await supabase
    .from("service_calls")
    .insert({
      restaurant_id: restaurantId,
      table_number: table,
      type,
      description: cleanDescription || null,
      status: "pending",
    });

  if (error) throw error;
}

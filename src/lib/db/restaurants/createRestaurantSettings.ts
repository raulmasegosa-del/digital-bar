import { supabaseAdmin } from "@/lib/supabase/server";

export async function createRestaurantSettings(
  restaurantId: string,
  name: string
) {
  if (!restaurantId) {
    throw new Error(
      "El restaurante es obligatorio."
    );
  }

  const { data, error } = await supabaseAdmin
    .from("restaurant_settings")
    .insert({
      restaurant_id: restaurantId,
      name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
import { supabaseAdmin } from "@/lib/supabase/server";

export async function createRestaurantSettings(
  restaurantId: string,
  name: string
) {
  const { data, error } = await supabaseAdmin
    .from("restaurant_settings")
    .insert({
      restaurant_id: restaurantId,
      name,
      accept_orders: true,
      primary_color: "#d97706",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
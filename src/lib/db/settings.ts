import { supabaseAdmin } from "@/lib/supabase/server";
import {
  RestaurantSettings,
  RestaurantSettingsInput,
} from "@/types/settings";

export async function getRestaurantSettings() {
  const { data, error } = await supabaseAdmin
    .from("restaurant_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
export async function updateRestaurantSettings(
  restaurantId: string,
  values: RestaurantSettingsInput
) {
  const { error } = await supabaseAdmin
    .from("restaurant_settings")
    .update(values)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw error;
  }
}
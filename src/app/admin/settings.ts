import { supabaseAdmin } from "@/lib/supabase/server";
import {
  RestaurantSettings,
  RestaurantSettingsInput,
} from "@/types/settings";

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const { data, error } = await supabaseAdmin
    .from("restaurant_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data as RestaurantSettings;
}

export async function updateRestaurantSettings(
  values: RestaurantSettingsInput
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("restaurant_settings")
    .update(values)
    .neq("id", "");

  if (error) throw error;
}
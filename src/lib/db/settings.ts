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

if (error) {
  console.error(error);
  throw error;
}
  return data as RestaurantSettings;
}

export async function updateRestaurantSettings(
  values: RestaurantSettingsInput
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("restaurant_settings")
    .update(values)
    .eq(
      "id",
      "27e62352-04ea-4881-a48b-83efe574bafa"
    );

  if (error) {
    console.error(error);
    throw error;
  }
}
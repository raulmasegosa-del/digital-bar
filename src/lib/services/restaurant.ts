import { getRestaurantSettings } from "@/lib/db/settings";

export async function getRestaurant() {
  return getRestaurantSettings();
}
import { supabaseAdmin } from "@/lib/supabase/server";

export type RestaurantTable = {
  id: string;
  restaurant_id: string;
  number: number;
  name: string | null;
  zone: string | null;
  active: boolean;
  qr_token: string | null;
  created_at: string;
};

export async function getRestaurantTables(
  restaurantId: string
): Promise<RestaurantTable[]> {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("id, restaurant_id, number, name, zone, active, qr_token, created_at")
    .eq("restaurant_id", restaurantId)
    .order("number", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as RestaurantTable[];
}

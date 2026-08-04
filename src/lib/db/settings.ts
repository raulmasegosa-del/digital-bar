import { supabaseAdmin } from "@/lib/supabase/server";

export async function getRestaurantSettings() {
  const { data, error } = await supabaseAdmin
    .from("restaurant_settings")
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function updateRestaurantSettings(values: {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  description: string;
  logo: string;
  primary_color: string;
  accept_orders: boolean;
}) {
  const { error } = await supabaseAdmin
    .from("restaurant_settings")
    .update(values)
    .neq("id", "");

  if (error) throw error;
}
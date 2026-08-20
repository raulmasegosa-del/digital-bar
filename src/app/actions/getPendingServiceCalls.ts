"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getPendingServiceCalls(restaurantId: string) {
  if (!restaurantId) return [];

  const { data, error } = await supabaseAdmin
    .from("service_calls")
    .select("id, table_number, type, status, created_at, restaurant_id, description")
    .eq("restaurant_id", restaurantId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

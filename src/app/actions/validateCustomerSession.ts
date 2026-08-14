"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function validateCustomerSession({ slug, table, token }: { slug: string; table: string; token: string }) {
  const restaurantSlug = slug.trim();
  const tableNumber = table.trim();
  const accessToken = token.trim();

  if (!restaurantSlug || !tableNumber || !accessToken) {
    return { valid: false as const };
  }

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("slug", restaurantSlug)
    .maybeSingle();
  if (restaurantError) throw restaurantError;
  if (!restaurant) return { valid: false as const };

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("table_sessions")
    .select("id, status, table_number")
    .eq("restaurant_id", restaurant.id)
    .eq("table_number", tableNumber)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (sessionError) throw sessionError;

  return {
    valid: Boolean(session && session.status === "open"),
    status: session?.status ?? "closed",
  };
}

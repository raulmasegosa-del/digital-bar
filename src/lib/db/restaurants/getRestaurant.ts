import { supabaseAdmin } from "@/lib/supabase/server";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getRestaurant(
  slug: string
): Promise<Restaurant | null> {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Restaurant | null;
}
import { supabaseAdmin } from "@/lib/supabase/server";

export async function createRestaurantRecord(
  name: string,
  slug: string,
  website: string | null
) {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({
      name,
      slug,
      website,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
import { supabaseAdmin } from "@/lib/supabase/server";

export async function createRestaurantRecord(
  name: string,
  slug: string
) {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({
      name,
      slug,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
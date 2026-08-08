import { supabaseAdmin } from "@/lib/supabase/server";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []) as Restaurant[];
}
import { supabaseAdmin } from "@/lib/supabase/server";

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

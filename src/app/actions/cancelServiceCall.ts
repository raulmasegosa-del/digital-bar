"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function cancelServiceCall(id: string) {
  if (!id) throw new Error("Aviso no identificado.");

  const { error } = await supabaseAdmin
    .from("service_calls")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) throw error;
}

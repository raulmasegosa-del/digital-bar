"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTableStatus(
  orderId: string,
  status: string
) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status,
    })
    .eq("id", orderId);

  if (error) {
    throw error;
  }

  revalidatePath("/admin/tables");
  revalidatePath(`/admin/tables`);
}
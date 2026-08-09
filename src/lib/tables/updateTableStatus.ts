"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import type { OrderStatus } from "@/types/tables";

export async function updateTableStatus(
  orderId: string,
  status: OrderStatus
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
}
import { supabase } from "@/lib/supabase/client";

import type { Order } from "@/types/orders";

export async function getActiveOrder(
  table: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("table_number", table)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Order | null;
}
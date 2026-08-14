"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function invalidateAvailableQrs(
  restaurantId: string,
  slug: string
) {
  if (!restaurantId || !slug) {
    throw new Error("Restaurante no válido.");
  }

  const { data: tables, error: tablesError } = await supabaseAdmin
    .from("tables")
    .select("id, number, qr_token")
    .eq("restaurant_id", restaurantId)
    .eq("active", true)
    .order("number", { ascending: true });

  if (tablesError) throw tablesError;

  const tableNumbers = (tables ?? []).map((table) => String(table.number));

  if (tableNumbers.length === 0) {
    revalidatePath(`/admin/${slug}/qr`);
    return { rotated: 0, protectedTables: [] as string[] };
  }

  const { data: activeOrders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("table_number")
    .eq("restaurant_id", restaurantId)
    .not("status", "in", "(completed,cancelled)")
    .in("table_number", tableNumbers);

  if (ordersError) throw ordersError;

  const protectedTables = Array.from(
    new Set((activeOrders ?? []).map((order) => String(order.table_number)))
  );
  const protectedSet = new Set(protectedTables);

  const tablesToRotate = (tables ?? []).filter(
    (table) => !protectedSet.has(String(table.number))
  );

  for (const table of tablesToRotate) {
    const { error } = await supabaseAdmin
      .from("tables")
      .update({ qr_token: crypto.randomUUID() })
      .eq("id", table.id)
      .eq("restaurant_id", restaurantId);

    if (error) throw error;
  }

  revalidatePath(`/admin/${slug}/qr`);

  return {
    rotated: tablesToRotate.length,
    protectedTables,
  };
}

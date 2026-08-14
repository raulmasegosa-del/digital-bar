"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurantMenu } from "@/lib/db/restaurants/menu/getRestaurantMenu";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { getRestaurantTables } from "@/lib/db/restaurants/tables/getRestaurantTables";

export async function addTableItems({
  slug,
  tableId,
  restaurantId,
  items,
  notes = "",
}: {
  slug: string;
  tableId: string;
  restaurantId: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number; options?: unknown }>;
  notes?: string;
}) {
  if (!items.length) throw new Error("No hay productos seleccionados.");

  const restaurant = await getRestaurant(slug);
  if (!restaurant || restaurant.id !== restaurantId) throw new Error("Restaurante no válido.");

  const tables = await getRestaurantTables(restaurantId);
  const table = tables.find((item) => item.id === tableId);
  if (!table) throw new Error("Mesa no encontrada.");

  // Only an order that is still in "pending" (Recibido) can receive more
  // items. If the table already has an order in Preparando/Servido, the new
  // items must become a fresh Recibido card so they are not hidden inside an
  // order that the waiter has already processed.
  const { data: activeOrder, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, total, notes")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", String(table.number))
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) throw orderError;

  let orderId = activeOrder?.id;

  if (!orderId) {
    const { data: created, error } = await supabaseAdmin
      .from("orders")
      .insert({ restaurant_id: restaurantId, table_number: String(table.number), status: "pending", total: 0, notes: "" })
      .select("id, total, notes")
      .single();
    if (error) throw error;
    orderId = created.id;
  }

  const rows = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options ?? [],
  }));

  const { error: itemError } = await supabaseAdmin.from("order_items").insert(rows);
  if (itemError) throw itemError;

  const addedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mergedNotes = notes.trim()
    ? activeOrder?.notes ? `${activeOrder.notes}\n${notes.trim()}` : notes.trim()
    : activeOrder?.notes ?? "";

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ total: Number(activeOrder?.total ?? 0) + addedTotal, notes: mergedNotes })
    .eq("id", orderId);
  if (updateError) throw updateError;

  revalidatePath(`/admin/${slug}/tables/${tableId}`);
  revalidatePath(`/admin/${slug}/orders`);
  revalidatePath(`/cocina/${slug}`);
}

export async function getTableMenu(restaurantId: string) {
  return getRestaurantMenu(restaurantId);
}

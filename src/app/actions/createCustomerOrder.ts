"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { CartItem } from "@/context/CartContext";

type Params = {
  restaurantId: string;
  table: string;
  items: CartItem[];
  notes: string;
  total: number;
};

export async function createCustomerOrder({ restaurantId, table, items, notes, total }: Params) {
  const tableNumber = table.trim();
  if (!restaurantId || !tableNumber || !items.length) {
    throw new Error("Faltan datos para enviar el pedido.");
  }

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .maybeSingle();
  if (restaurantError) throw restaurantError;
  if (!restaurant) throw new Error("Restaurante no encontrado.");

  const { data: tableRow, error: tableError } = await supabaseAdmin
    .from("tables")
    .select("id, number, active")
    .eq("restaurant_id", restaurantId)
    .eq("number", Number(tableNumber))
    .maybeSingle();
  if (tableError) throw tableError;
  if (!tableRow) throw new Error("La mesa indicada no existe en este restaurante.");
  if (!tableRow.active) throw new Error("Esta mesa no está disponible.");

  // Solo se puede seguir acumulando en un pedido que todavía está en
  // "Recibido". En cuanto el camarero lo pasa a Preparando (o a cualquier
  // estado posterior), ese pedido queda cerrado para nuevas incorporaciones.
  const { data: pendingOrder, error: pendingOrderError } = await supabaseAdmin
    .from("orders")
    .select("id, total, notes, status")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (pendingOrderError) throw pendingOrderError;

  const orderId = pendingOrder?.id ?? null;
  const orderTotal = Number(pendingOrder?.total ?? 0) + Number(total);
  const orderNotes = notes?.trim()
    ? pendingOrder?.notes
      ? `${pendingOrder.notes}\n${notes.trim()}`
      : notes.trim()
    : pendingOrder?.notes ?? "";

  let finalOrderId = orderId;
  let finalStatus = pendingOrder?.status ?? "pending";

  // Si no existe un pedido en Recibido, crear SIEMPRE uno nuevo.
  // Esto evita añadir productos a pedidos que ya están en Preparando,
  // Servido, etc.
  if (!finalOrderId) {
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        restaurant_id: restaurantId,
        table_number: tableNumber,
        notes: notes?.trim() ?? "",
        total: Number(total),
        status: "pending",
      })
      .select("id, total, notes, status")
      .single();
    if (orderError) throw orderError;
    finalOrderId = order.id;
    finalStatus = order.status ?? "pending";
  }

  const rows = items.map((item) => ({
    order_id: finalOrderId,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    options: item.options ?? [],
  }));

  const { error: itemError } = await supabaseAdmin.from("order_items").insert(rows);
  if (itemError) throw itemError;

  if (pendingOrder) {
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ total: orderTotal, notes: orderNotes })
      .eq("id", finalOrderId);
    if (updateError) throw updateError;
  }

  return {
    id: finalOrderId,
    table: tableNumber,
    status: finalStatus,
    total: pendingOrder ? orderTotal : Number(total),
  };
}

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getCustomerOrders(restaurantId: string, table: string, sessionToken: string) {
  const token = sessionToken.trim();
  const tableNumber = table.trim();
  if (!restaurantId || !tableNumber || !token) throw new Error("Esta sesión no es válida.");

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("table_sessions")
    .select("id, status, table_number")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("access_token", token)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Esta sesión ya no es válida. Escanea de nuevo el QR.");

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("id, table_number, status, total, created_at, notes")
    .eq("restaurant_id", restaurantId)
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });
  if (ordersError) throw ordersError;

  const ids = (orders ?? []).map((order) => order.id);
  if (!ids.length) return [];

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("id, order_id, name, quantity, price, options")
    .in("order_id", ids);
  if (itemsError) throw itemsError;

  return (orders ?? []).map((order) => ({
    ...order,
    total: Number(order.total ?? 0),
    items: (items ?? []).filter((item) => item.order_id === order.id).map((item) => ({
      ...item,
      quantity: Number(item.quantity ?? 0),
      price: Number(item.price ?? 0),
      options: Array.isArray(item.options) ? item.options : [],
    })),
  }));
}

export async function cancelCustomerOrder(restaurantId: string, table: string, sessionToken: string, orderId: string) {
  const token = sessionToken.trim();
  const tableNumber = table.trim();
  if (!restaurantId || !tableNumber || !token || !orderId) throw new Error("Datos de sesión incompletos.");

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("table_sessions")
    .select("id, status")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("access_token", token)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session || session.status !== "open") throw new Error("Esta sesión ya no está activa.");

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("session_id", session.id)
    .maybeSingle();
  if (orderError) throw orderError;
  if (!order) throw new Error("Pedido no encontrado.");
  if (order.status !== "pending") throw new Error("Este pedido ya no se puede cancelar porque ha dejado de estar en Recibido.");

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", "pending");
  if (updateError) throw updateError;
  return { ok: true };
}

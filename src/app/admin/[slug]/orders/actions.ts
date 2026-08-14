"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { isSuperAdmin } from "@/lib/auth/isSuperAdmin";
import type { OrderStatus } from "@/types/orders";

const allowedStatuses: OrderStatus[] = ["pending", "preparing", "ready", "served", "bill", "completed", "cancelled"];
type PaymentMethod = "cash" | "card";

export async function updateRestaurantOrderStatus(slug: string, orderId: string, status: OrderStatus, orderIds: string[] = [], paymentMethod?: PaymentMethod) {
  if (!allowedStatuses.includes(status)) throw new Error("Estado de pedido no válido");
  if (status === "completed" && paymentMethod !== "cash" && paymentMethod !== "card") throw new Error("Debes indicar si el pago es en efectivo o con tarjeta");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const restaurant = await getRestaurant(slug);
  if (!restaurant) throw new Error("Restaurante no encontrado");
  const superAdmin = await isSuperAdmin(user.id);
  if (!superAdmin) {
    const { data: membership, error } = await supabase.from("restaurant_users").select("restaurant_id, role").eq("user_id", user.id).eq("restaurant_id", restaurant.id).in("role", ["owner", "staff"]).maybeSingle();
    if (error) throw error;
    if (!membership) throw new Error("Restaurante no autorizado");
  }

  const ids = Array.from(new Set([orderId, ...orderIds].filter(Boolean)));
  if (status === "completed") {
    const { data: ordersToClose, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("id, total, table_number, session_id, status")
      .in("id", ids)
      .eq("restaurant_id", restaurant.id);
    if (ordersError) throw ordersError;
    if (!ordersToClose?.length) throw new Error("No se encontraron los pedidos para cobrar");

    const tableNumbers = Array.from(new Set(ordersToClose.map((order) => String(order.table_number ?? "")).filter(Boolean)));
    if (tableNumbers.length !== 1) throw new Error("No se pueden cobrar juntas mesas diferentes");
    const tableNumber = tableNumbers[0];

    const sessionIds = Array.from(new Set(ordersToClose.map((order) => order.session_id).filter(Boolean))) as string[];
    const ordersWithoutSession = ordersToClose.filter((order) => !order.session_id);
    if (sessionIds.length > 1) throw new Error("Los pedidos agrupados no pertenecen a una única sesión de mesa");

    let sessionId: string;
    if (sessionIds.length === 1) {
      sessionId = sessionIds[0];
      if (ordersWithoutSession.length) {
        const { error: attachError } = await supabaseAdmin.from("orders").update({ session_id: sessionId }).in("id", ordersWithoutSession.map((order) => order.id)).eq("restaurant_id", restaurant.id).is("session_id", null);
        if (attachError) throw attachError;
      }
    } else {
      const { data: activeSession, error: activeSessionError } = await supabaseAdmin
        .from("table_sessions")
        .select("id, status, table_number")
        .eq("restaurant_id", restaurant.id)
        .eq("table_number", tableNumber)
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (activeSessionError) throw activeSessionError;
      if (!activeSession) throw new Error("No hay una sesión abierta para esta mesa");
      sessionId = activeSession.id;
      const { error: attachError } = await supabaseAdmin.from("orders").update({ session_id: sessionId }).in("id", ordersToClose.map((order) => order.id)).eq("restaurant_id", restaurant.id).is("session_id", null);
      if (attachError) throw attachError;
    }

    const { data: session, error: sessionError } = await supabaseAdmin.from("table_sessions").select("id, status, table_number").eq("id", sessionId).eq("restaurant_id", restaurant.id).maybeSingle();
    if (sessionError) throw sessionError;
    if (!session || session.status !== "open") throw new Error("La sesión de esta mesa ya está cerrada");

    const total = ordersToClose.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
    if (total <= 0) throw new Error("El importe a cobrar debe ser superior a 0 €");

    const { data: cashRegister, error: cashError } = await supabaseAdmin.from("cash_registers").select("id").eq("restaurant_id", restaurant.id).is("closed_at", null).maybeSingle();
    if (cashError) throw cashError;
    if (!cashRegister) throw new Error("No hay una caja abierta. Inicia la caja antes de cobrar mesas.");

    const { data: existingPayment, error: existingPaymentError } = await supabaseAdmin.from("payments").select("id").eq("table_session_id", sessionId).maybeSingle();
    if (existingPaymentError) throw existingPaymentError;
    if (existingPayment) throw new Error("Esta mesa ya tiene registrado un pago");

    const { error: paymentError } = await supabaseAdmin.from("payments").insert({ restaurant_id: restaurant.id, table_session_id: sessionId, cash_register_id: cashRegister.id, table_number: session.table_number, amount: total, payment_method: paymentMethod });
    if (paymentError) throw paymentError;

    const { data: updatedOrders, error: updateError } = await supabaseAdmin.from("orders").update({ status: "completed" }).in("id", ids).eq("restaurant_id", restaurant.id).select("id, status");
    if (updateError) throw updateError;
    if (!updatedOrders?.length) throw new Error("No se pudieron cerrar los pedidos");

    const { error: closeError } = await supabaseAdmin.from("table_sessions").update({ status: "closed", closed_at: new Date().toISOString() }).eq("id", sessionId).eq("restaurant_id", restaurant.id).eq("status", "open");
    if (closeError) throw closeError;

    revalidatePath(`/admin/${slug}/orders`, "page");
    revalidatePath(`/admin/${slug}/tables`, "page");
    revalidatePath(`/admin/${slug}/cash`, "page");
    revalidatePath(`/admin/${slug}`, "page");
    return { id: orderId, status: "completed" as OrderStatus, updatedCount: updatedOrders.length, paymentMethod, total };
  }

  const { data: updatedOrders, error } = await supabaseAdmin.from("orders").update({ status }).in("id", ids).eq("restaurant_id", restaurant.id).select("id, status");
  if (error) throw error;
  if (!updatedOrders?.length) throw new Error("No se encontraron los pedidos para actualizar");
  revalidatePath(`/admin/${slug}/orders`, "page");
  revalidatePath(`/admin/${slug}/tables`, "page");
  return { id: orderId, status: updatedOrders[0].status as OrderStatus, updatedCount: updatedOrders.length };
}

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

type PaymentMethod = "cash" | "card";

export async function resolveBillServiceCall(
  restaurantId: string,
  callIds: string[],
  paymentMethod: PaymentMethod
) {
  if (!restaurantId || !callIds.length) throw new Error("Aviso de cuenta no identificado.");
  if (paymentMethod !== "cash" && paymentMethod !== "card") throw new Error("Método de pago no válido.");

  const { data: calls, error: callsError } = await supabaseAdmin
    .from("service_calls")
    .select("id, table_number, type, status, session_id")
    .in("id", callIds)
    .eq("restaurant_id", restaurantId)
    .eq("status", "pending");
  if (callsError) throw callsError;
  if (!calls?.length) throw new Error("El aviso de cuenta ya está resuelto.");
  if (calls.some((call) => call.type !== "bill")) throw new Error("Solo se puede cerrar una solicitud de cuenta desde aquí.");

  const tableNumber = calls[0].table_number;
  if (calls.some((call) => call.table_number !== tableNumber)) throw new Error("Los avisos no pertenecen a la misma mesa.");

  let sessionId = calls.find((call) => call.session_id)?.session_id ?? null;
  if (!sessionId) {
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("table_sessions")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("table_number", tableNumber)
      .eq("status", "open")
      .maybeSingle();
    if (sessionError) throw sessionError;
    sessionId = session?.id ?? null;
  }
  if (!sessionId) throw new Error("No hay una sesión abierta para esta mesa.");

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("table_sessions")
    .select("id, status, table_number")
    .eq("id", sessionId)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session || session.status !== "open") throw new Error("La mesa ya está cerrada.");

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("id, total, status")
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("session_id", sessionId)
    .not("status", "in", "(completed,cancelled)");
  if (ordersError) throw ordersError;
  if (!orders?.length) throw new Error("No hay pedidos pendientes para cobrar en esta mesa.");

  const total = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  if (total <= 0) throw new Error("El importe a cobrar debe ser superior a 0 €.");

  const { data: existingPayment, error: existingPaymentError } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("table_session_id", sessionId)
    .maybeSingle();
  if (existingPaymentError) throw existingPaymentError;
  if (existingPayment) throw new Error("Esta mesa ya tiene registrado un pago.");

  const { error: paymentError } = await supabaseAdmin.from("payments").insert({
    restaurant_id: restaurantId,
    table_session_id: sessionId,
    table_number: tableNumber,
    amount: total,
    payment_method: paymentMethod,
  });
  if (paymentError) throw paymentError;

  const orderIds = orders.map((order) => order.id);
  const { error: ordersUpdateError } = await supabaseAdmin
    .from("orders")
    .update({ status: "completed" })
    .in("id", orderIds)
    .eq("restaurant_id", restaurantId);
  if (ordersUpdateError) throw ordersUpdateError;

  const { error: sessionCloseError } = await supabaseAdmin
    .from("table_sessions")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("restaurant_id", restaurantId)
    .eq("status", "open");
  if (sessionCloseError) throw sessionCloseError;

  const { error: callsUpdateError } = await supabaseAdmin
    .from("service_calls")
    .update({ status: "done" })
    .in("id", calls.map((call) => call.id))
    .eq("restaurant_id", restaurantId);
  if (callsUpdateError) throw callsUpdateError;

  return { tableNumber, total, paymentMethod, sessionId };
}

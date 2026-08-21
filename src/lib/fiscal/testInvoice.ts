import { supabaseAdmin as supabase } from "@/lib/supabase/server";
import { createFiscalInvoiceFromOrder } from "@/lib/fiscal/createFiscalInvoice";

/**
 * Backwards-compatible test entry point.
 * The fiscal engine itself is now multi-restaurant; this wrapper keeps the
 * existing admin test action working while remaining explicitly test-only.
 */
export async function createTestFiscalInvoiceFromOrder(orderId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("restaurant_id")
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  if (!order?.restaurant_id) throw new Error("El pedido no tiene restaurante");

  return createFiscalInvoiceFromOrder(orderId, order.restaurant_id, "test");
}

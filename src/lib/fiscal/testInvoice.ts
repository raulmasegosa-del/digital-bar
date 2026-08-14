import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const TEST_RESTAURANT_ID = "112104d6-d043-482b-bf2b-5121c4fb9749";
const TEST_SERIES = "T";

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function createTestFiscalInvoiceFromOrder(orderId: string) {
  const supabase = createSupabaseAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, restaurant_id, total, status, created_at")
    .eq("id", orderId)
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .maybeSingle();
  if (orderError) throw orderError;
  if (!order) throw new Error("Pedido no encontrado");
  if (order.status !== "completed") throw new Error("Solo se puede facturar un pedido cobrado");

  const { data: existingInvoice } = await supabase
    .from("fiscal_invoices")
    .select("id, invoice_number")
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .eq("order_id", orderId)
    .maybeSingle();
  if (existingInvoice) return existingInvoice;

  const { data: settings, error: settingsError } = await supabase
    .from("restaurant_settings")
    .select("fiscal_name, fiscal_nif, fiscal_address, fiscal_postal_code, fiscal_city")
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .maybeSingle();
  if (settingsError) throw settingsError;
  if (!settings?.fiscal_name || !settings?.fiscal_nif || !settings?.fiscal_address) {
    throw new Error("Faltan datos fiscales del emisor");
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("name, quantity, price, tax_rate, tax_amount")
    .eq("order_id", orderId);
  if (itemsError) throw itemsError;
  if (!items?.length) throw new Error("El pedido no contiene líneas");

  const taxMap = new Map<number, { base: number; tax: number }>();
  for (const item of items) {
    const rate = Number(item.tax_rate ?? 0);
    const gross = round2(Number(item.price ?? 0) * Number(item.quantity ?? 0));
    const tax = round2(Number(item.tax_amount ?? 0) * Number(item.quantity ?? 0));
    const base = round2(gross - tax);
    const current = taxMap.get(rate) ?? { base: 0, tax: 0 };
    current.base = round2(current.base + base);
    current.tax = round2(current.tax + tax);
    taxMap.set(rate, current);
  }

  const taxBreakdown = Array.from(taxMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([rate, values]) => ({ rate, base: values.base, tax: values.tax }));
  const totalTax = round2(taxBreakdown.reduce((sum, row) => sum + row.tax, 0));
  const totalAmount = round2(Number(order.total ?? 0));
  const issuedAt = new Date().toISOString();

  const { data: series, error: seriesError } = await supabase
    .from("fiscal_series")
    .select("id, next_number")
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .eq("series", TEST_SERIES)
    .eq("environment", "test")
    .maybeSingle();
  if (seriesError) throw seriesError;
  if (!series) throw new Error("Serie fiscal de pruebas no configurada");

  const number = Number(series.next_number);
  const invoiceNumber = `${TEST_SERIES}-${String(number).padStart(6, "0")}`;

  const invoicePayload = {
    restaurant_id: TEST_RESTAURANT_ID,
    order_id: orderId,
    series: TEST_SERIES,
    number,
    invoice_number: invoiceNumber,
    invoice_type: "F2",
    issued_at: issuedAt,
    issuer_name: settings.fiscal_name,
    issuer_nif: settings.fiscal_nif,
    issuer_address: `${settings.fiscal_address}, ${settings.fiscal_postal_code ?? ""} ${settings.fiscal_city ?? ""}`.trim(),
    items,
    tax_breakdown: taxBreakdown,
    total_tax: totalTax,
    total_amount: totalAmount,
    status: "issued",
  };

  const { data: invoice, error: invoiceError } = await supabase
    .from("fiscal_invoices")
    .insert(invoicePayload)
    .select("id, invoice_number, invoice_type, issued_at, total_tax, total_amount")
    .single();
  if (invoiceError) throw invoiceError;

  const { data: previous } = await supabase
    .from("fiscal_records")
    .select("issuer_nif, invoice_number, issued_at, hash")
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .eq("environment", "test")
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const generatedAt = new Date().toISOString();
  const canonical = JSON.stringify({
    issuer_nif: settings.fiscal_nif,
    invoice_number: invoiceNumber,
    issued_at: issuedAt,
    invoice_type: "F2",
    total_tax: totalTax,
    total_amount: totalAmount,
    previous_issuer_nif: previous?.issuer_nif ?? null,
    previous_invoice_number: previous?.invoice_number ?? null,
    previous_issued_at: previous?.issued_at ?? null,
    previous_hash: previous?.hash ?? null,
  });
  const hash = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");

  const { data: record, error: recordError } = await supabase
    .from("fiscal_records")
    .insert({
      restaurant_id: TEST_RESTAURANT_ID,
      invoice_id: invoice.id,
      record_type: "alta",
      issuer_nif: settings.fiscal_nif,
      invoice_number: invoiceNumber,
      issued_at: issuedAt,
      invoice_type: "F2",
      total_tax: totalTax,
      total_amount: totalAmount,
      previous_issuer_nif: previous?.issuer_nif ?? null,
      previous_invoice_number: previous?.invoice_number ?? null,
      previous_issued_at: previous?.issued_at ?? null,
      previous_hash: previous?.hash ?? null,
      generated_at: generatedAt,
      hash_algorithm: "01",
      hash,
      status: "pending",
      environment: "test",
    })
    .select("id, invoice_number, hash, previous_hash, status, environment")
    .single();
  if (recordError) throw recordError;

  await supabase
    .from("fiscal_series")
    .update({ next_number: number + 1, updated_at: new Date().toISOString() })
    .eq("id", series.id)
    .eq("next_number", number);

  return { invoice, record };
}

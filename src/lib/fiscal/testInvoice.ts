import crypto from "node:crypto";
import { supabaseAdmin as supabase } from "@/lib/supabase/server";

const TEST_RESTAURANT_ID = "112104d6-d043-482b-bf2b-5121c4fb9749";
const TEST_SERIES = "T";
const SIF = {
  // AEAT XSD: IdSistemaInformatico is TextMax2Type.
  identifier: "DB",
  producerName: "DIGITAL BAR PRUEBAS, S.L.",
  producerTaxId: "B12345678",
  name: "DIGITAL BAR",
  version: "0.1.0-test",
  installationId: "DIGITAL-BAR-TEST-01",
  onlyVerifactu: false,
  multiOt: true,
  multipleOtIndicator: false,
};

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatDateDDMMYYYY(iso: string) {
  const date = new Date(iso);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getUTCFullYear()}`;
}

function formatDateISO(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function formatMadridTimestamp(iso: string) {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const local = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
  const madridFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", timeZoneName: "longOffset" });
  const offsetPart = madridFormatter.formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "GMT+02:00";
  const offset = offsetPart.replace("GMT", "") || "+00:00";
  return `${local}${offset}`;
}

function buildAltaHashInput(args: {
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  invoiceType: string;
  totalTax: number;
  totalAmount: number;
  previousHash: string | null;
  generatedAt: string;
}) {
  return [
    `IDEmisorFactura=${args.issuerNif}`,
    `NumSerieFactura=${args.invoiceNumber}`,
    `FechaExpedicionFactura=${formatDateDDMMYYYY(args.issuedAt)}`,
    `TipoFactura=${args.invoiceType}`,
    `CuotaTotal=${args.totalTax.toFixed(2)}`,
    `ImporteTotal=${args.totalAmount.toFixed(2)}`,
    `Huella=${args.previousHash ?? ""}`,
    `FechaHoraHusoGenRegistro=${formatMadridTimestamp(args.generatedAt)}`,
  ].join("&");
}

export async function createTestFiscalInvoiceFromOrder(orderId: string) {
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
    operation_date: formatDateISO(issuedAt),
    operation_description: "Servicios de hostelería y restauración",
    tax_regime: "01",
    reverse_charge: false,
    rectifying: false,
    simplified_substitution: false,
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
    .select("issuer_nif, invoice_number, issued_at, hash, record_type")
    .eq("restaurant_id", TEST_RESTAURANT_ID)
    .eq("environment", "test")
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const generatedAt = new Date().toISOString();
  const hashInput = buildAltaHashInput({
    issuerNif: settings.fiscal_nif,
    invoiceNumber,
    issuedAt,
    invoiceType: "F2",
    totalTax,
    totalAmount,
    previousHash: previous?.hash ?? null,
    generatedAt,
  });
  const hash = crypto.createHash("sha256").update(hashInput, "utf8").digest("hex").toUpperCase();
  const generatedAtLocal = formatMadridTimestamp(generatedAt);

  const aeatPayload = {
    RegistroAlta: {
      IDFactura: {
        IDEmisorFactura: settings.fiscal_nif,
        NumSerieFactura: invoiceNumber,
        FechaExpedicionFactura: formatDateDDMMYYYY(issuedAt),
      },
      TipoFactura: "F2",
      CuotaTotal: totalTax.toFixed(2),
      ImporteTotal: totalAmount.toFixed(2),
      Encadenamiento: {
        PrimerRegistro: previous ? "N" : "S",
        RegistroAnterior: previous
          ? {
              IDEmisorFactura: previous.issuer_nif,
              NumSerieFactura: previous.invoice_number,
              FechaExpedicionFactura: formatDateDDMMYYYY(previous.issued_at),
              Huella: previous.hash,
            }
          : null,
      },
      SistemaInformatico: {
        NombreRazon: SIF.producerName,
        NIF: SIF.producerTaxId,
        NombreSistemaInformatico: SIF.name,
        IdSistemaInformatico: SIF.identifier,
        Version: SIF.version,
        NumeroInstalacion: SIF.installationId,
        TipoUsoPosibleSoloVerifactu: SIF.onlyVerifactu ? "S" : "N",
        TipoUsoPosibleMultiOT: SIF.multiOt ? "S" : "N",
        IndicadorMultiplesOT: SIF.multipleOtIndicator ? "S" : "N",
      },
      FechaHoraHusoGenRegistro: generatedAtLocal,
      TipoHuella: "01",
      Huella: hash,
    },
  };

  const { data: record, error: recordError } = await supabase
    .from("fiscal_records")
    .insert({
      restaurant_id: TEST_RESTAURANT_ID,
      invoice_id: invoice.id,
      record_type: "alta",
      record_version: "1.0",
      issuer_nif: settings.fiscal_nif,
      invoice_number: invoiceNumber,
      issued_at: issuedAt,
      operation_date: formatDateISO(issuedAt),
      operation_description: "Servicios de hostelería y restauración",
      invoice_type: "F2",
      total_tax: totalTax,
      total_amount: totalAmount,
      tax_regime: "01",
      reverse_charge: false,
      rectifying: false,
      previous_issuer_nif: previous?.issuer_nif ?? null,
      previous_invoice_number: previous?.invoice_number ?? null,
      previous_issued_at: previous?.issued_at ?? null,
      previous_chain_record_type: previous?.record_type ?? null,
      generated_at: generatedAt,
      generated_at_local: generatedAtLocal,
      hash_algorithm: "01",
      hash_input: { canonical: hashInput },
      hash,
      sif_identifier: SIF.identifier,
      sif_producer_name: SIF.producerName,
      sif_producer_tax_id: SIF.producerTaxId,
      sif_name: SIF.name,
      sif_version: SIF.version,
      sif_installation_id: SIF.installationId,
      sif_only_verifactu: SIF.onlyVerifactu,
      aeat_payload: aeatPayload,
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

import { supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import TestFiscalInvoiceButton from "./TestFiscalInvoiceButton";
import VerifyFiscalChainButton from "./VerifyFiscalChainButton";
import FiscalInvoiceQr from "./FiscalInvoiceQr";
import FiscalConfigurationForm from "./FiscalConfigurationForm";

const TEST_SERIES = "T";

export default async function VeriFactuTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) return null;

  const [{ data: settings }, { data: orders }, { data: invoices }, { data: series }, { data: records }] = await Promise.all([
    supabaseAdmin
      .from("restaurant_settings")
      .select("fiscal_name, fiscal_nif, fiscal_address, fiscal_postal_code, fiscal_city")
      .eq("restaurant_id", restaurant.id)
      .maybeSingle(),
    supabaseAdmin
      .from("orders")
      .select("id, table_number, total, status, created_at")
      .eq("restaurant_id", restaurant.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("fiscal_invoices")
      .select("order_id")
      .eq("restaurant_id", restaurant.id),
    supabaseAdmin
      .from("fiscal_series")
      .select("series, next_number")
      .eq("restaurant_id", restaurant.id)
      .eq("series", TEST_SERIES)
      .eq("environment", "test")
      .maybeSingle(),
    supabaseAdmin
      .from("fiscal_records")
      .select("id, invoice_number, invoice_type, total_amount, total_tax, hash, previous_hash, status, environment, generated_at, issuer_nif, issued_at")
      .eq("restaurant_id", restaurant.id)
      .order("generated_at", { ascending: false })
      .limit(10),
  ]);

  const invoicedOrderIds = new Set((invoices ?? []).map((invoice) => invoice.order_id).filter(Boolean));
  const candidates = (orders ?? []).filter((order) => !invoicedOrderIds.has(order.id));
  const nextNumber = series?.next_number ? Number(series.next_number) : null;
  const nextInvoiceNumber = series && nextNumber
    ? `${TEST_SERIES}-${String(nextNumber).padStart(6, "0")}`
    : "No configurada";

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VERI*FACTU · {restaurant.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Configuración fiscal y entorno de pruebas. No se envía información a la AEAT.</p>
      </div>

      <section className="rounded-xl border p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Configuración fiscal del restaurante</h2>
          <p className="text-sm text-gray-600 mt-1">Estos datos pertenecen exclusivamente a este restaurante. La serie y el próximo número se introducen manualmente; Digital Bar no los deduce de facturas anteriores.</p>
        </div>
        <FiscalConfigurationForm
          slug={slug}
          initial={{
            fiscalName: settings?.fiscal_name ?? "",
            fiscalNif: settings?.fiscal_nif ?? "",
            fiscalAddress: settings?.fiscal_address ?? "",
            fiscalPostalCode: settings?.fiscal_postal_code ?? "",
            fiscalCity: settings?.fiscal_city ?? "",
            testSeries: series?.series ?? "",
            testNextNumber: nextNumber,
          }}
        />
      </section>

      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Generar factura de prueba</h2>
        <p className="text-sm text-gray-600">La siguiente factura será <strong>{nextInvoiceNumber}</strong>. Si no has configurado una serie, no se puede generar ninguna factura de prueba.</p>
        <div className="space-y-3">
          {series ? candidates.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <div className="font-medium">Mesa {order.table_number} · {Number(order.total).toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{order.id} · {new Date(order.created_at).toLocaleString("es-ES")}</div>
              </div>
              <TestFiscalInvoiceButton orderId={order.id} invoiceNumber={nextInvoiceNumber} />
            </div>
          )) : <p className="text-sm text-amber-700">Configura primero una serie de pruebas.</p>}
          {series && !candidates.length && <p className="text-sm text-gray-500">No hay pedidos cobrados pendientes de facturar.</p>}
        </div>
      </section>

      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Integridad de la cadena</h2>
        <p className="text-sm text-gray-600">Comprueba el encadenamiento, la numeración, el orden temporal y los hashes verificables del entorno de pruebas.</p>
        <VerifyFiscalChainButton slug={slug} />
      </section>

      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Registros fiscales generados</h2>
        {records?.length ? records.map((record) => (
          <div key={record.id} className="rounded-lg border p-4 text-sm space-y-1">
            <div className="font-semibold">{record.invoice_number} · {record.invoice_type} · {Number(record.total_amount).toFixed(2)} €</div>
            <div>IVA: {Number(record.total_tax).toFixed(2)} € · {record.environment} · {record.status}</div>
            <div className="break-all text-xs">Hash: {record.hash}</div>
            <div className="break-all text-xs">Hash anterior: {record.previous_hash ?? "(primero de la cadena)"}</div>
            <FiscalInvoiceQr
              issuerNif={record.issuer_nif}
              invoiceNumber={record.invoice_number}
              issuedAt={record.issued_at}
              totalAmount={Number(record.total_amount)}
            />
          </div>
        )) : <p className="text-sm text-gray-500">Todavía no hay registros fiscales.</p>}
      </section>
    </main>
  );
}

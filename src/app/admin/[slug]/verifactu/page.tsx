import { createTestFiscalInvoice } from "@/app/actions/createTestFiscalInvoice";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

const TEST_ORDER_ID = "4a76c244-a8d5-4c77-a100-22c047a3fc02";

export default async function VeriFactuTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) return null;

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id, table_number, total, status, created_at")
    .eq("restaurant_id", restaurant.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: testOrder } = await supabaseAdmin
    .from("orders")
    .select("id, table_number, total, status, created_at")
    .eq("id", TEST_ORDER_ID)
    .maybeSingle();

  const candidates = testOrder && !orders?.some((order) => order.id === testOrder.id)
    ? [testOrder, ...(orders ?? [])]
    : (orders ?? []);

  const { data: records } = await supabaseAdmin
    .from("fiscal_records")
    .select("id, invoice_number, invoice_type, total_amount, total_tax, hash, previous_hash, status, environment, generated_at")
    .eq("restaurant_id", restaurant.id)
    .order("generated_at", { ascending: false })
    .limit(10);

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VERI*FACTU · Pruebas</h1>
        <p className="text-sm text-gray-500 mt-1">Entorno ficticio. No se envía información a la AEAT.</p>
      </div>
      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Generar factura de prueba</h2>
        <p className="text-sm text-gray-600">El pedido de la mesa 6 de 14,00 € está preparado como primera prueba.</p>
        <div className="space-y-3">
          {candidates.map((order) => (
            <form key={order.id} action={createTestFiscalInvoice} className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <div className="font-medium">Mesa {order.table_number} · {Number(order.total).toFixed(2)} €</div>
                <div className="text-xs text-gray-500">{order.id} · {new Date(order.created_at).toLocaleString("es-ES")}</div>
              </div>
              <input type="hidden" name="orderId" value={order.id} />
              <button type="submit" className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">🧾 Generar T-000001</button>
            </form>
          ))}
          {!candidates.length && <p className="text-sm text-gray-500">No hay pedidos disponibles.</p>}
        </div>
      </section>
      <section className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Registros fiscales generados</h2>
        {records?.length ? records.map((record) => (
          <div key={record.id} className="rounded-lg border p-4 text-sm space-y-1">
            <div className="font-semibold">{record.invoice_number} · {record.invoice_type} · {Number(record.total_amount).toFixed(2)} €</div>
            <div>IVA: {Number(record.total_tax).toFixed(2)} € · {record.environment} · {record.status}</div>
            <div className="break-all text-xs">Hash: {record.hash}</div>
            <div className="break-all text-xs">Hash anterior: {record.previous_hash ?? "(primero de la cadena)"}</div>
          </div>
        )) : <p className="text-sm text-gray-500">Todavía no hay registros fiscales.</p>}
      </section>
    </main>
  );
}

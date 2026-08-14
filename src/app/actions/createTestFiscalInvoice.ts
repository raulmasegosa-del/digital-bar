"use server";

import { revalidatePath } from "next/cache";
import { createTestFiscalInvoiceFromOrder } from "@/lib/fiscal/testInvoice";

export type TestFiscalInvoiceActionState = {
  ok: boolean;
  message: string;
};

export async function createTestFiscalInvoice(
  _previousState: TestFiscalInvoiceActionState,
  formData: FormData,
): Promise<TestFiscalInvoiceActionState> {
  try {
    const orderId = String(formData.get("orderId") ?? "");
    if (!orderId) return { ok: false, message: "Falta el pedido de prueba." };
    const result = await createTestFiscalInvoiceFromOrder(orderId);
    revalidatePath("/admin/[slug]/verifactu", "page");
    return { ok: true, message: `Factura ${result.record.invoice_number} generada correctamente.` };
  } catch (error) {
    console.error("VERI*FACTU test invoice error", error);
    const message = error instanceof Error ? error.message : "No se pudo generar la factura de prueba.";
    return { ok: false, message };
  }
}

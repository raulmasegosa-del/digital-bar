"use server";

import { revalidatePath } from "next/cache";
import { createTestFiscalInvoiceFromOrder } from "@/lib/fiscal/testInvoice";

export async function createTestFiscalInvoice(formData: FormData): Promise<void> {
  try {
    const orderId = String(formData.get("orderId") ?? "");
    if (!orderId) throw new Error("Falta el pedido de prueba.");

    const result = await createTestFiscalInvoiceFromOrder(orderId);
    revalidatePath("/admin/[slug]/verifactu", "page");

    const invoiceNumber = "record" in result ? result.record.invoice_number : result.invoice.invoice_number;
    console.log(`Factura ${invoiceNumber} generada correctamente.`);
  } catch (error) {
    console.error("VERI*FACTU test invoice error", error);
    throw error;
  }
}

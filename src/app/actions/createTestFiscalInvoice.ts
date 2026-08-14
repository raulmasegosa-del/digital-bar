"use server";

import { createTestFiscalInvoiceFromOrder } from "@/lib/fiscal/testInvoice";

export async function createTestFiscalInvoice(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) throw new Error("Falta orderId");
  await createTestFiscalInvoiceFromOrder(orderId);
}

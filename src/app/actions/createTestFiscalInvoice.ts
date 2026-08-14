"use server";

import { createTestFiscalInvoiceFromOrder } from "@/lib/fiscal/testInvoice";

export async function createTestFiscalInvoice(orderId: string) {
  if (!orderId) throw new Error("Falta orderId");
  return createTestFiscalInvoiceFromOrder(orderId);
}

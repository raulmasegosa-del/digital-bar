import { createFiscalInvoiceFromOrder } from "@/lib/fiscal/createFiscalInvoice";

/**
 * Backwards-compatible test entry point.
 * The fiscal engine itself is now multi-restaurant; this wrapper keeps the
 * existing admin test action working while remaining explicitly test-only.
 */
export async function createTestFiscalInvoiceFromOrder(
  orderId: string,
  restaurantId: string,
) {
  return createFiscalInvoiceFromOrder(orderId, restaurantId, "test");
}

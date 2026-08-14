"use client";

import { useActionState } from "react";
import { createTestFiscalInvoice, type TestFiscalInvoiceActionState } from "@/app/actions/createTestFiscalInvoice";

const initialState: TestFiscalInvoiceActionState = { ok: false, message: "" };

export default function TestFiscalInvoiceButton({ orderId, invoiceNumber }: { orderId: string; invoiceNumber: string }) {
  const [state, formAction, pending] = useActionState(createTestFiscalInvoice, initialState);

  return (
    <div className="flex flex-col items-end gap-2">
      <form action={formAction}>
        <input type="hidden" name="orderId" value={orderId} />
        <button type="submit" disabled={pending} className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {pending ? "Generando…" : `🧾 Generar ${invoiceNumber}`}
        </button>
      </form>
      {state.message && (
        <p className={`max-w-xs text-right text-xs ${state.ok ? "text-green-600" : "text-red-600"}`} aria-live="polite">
          {state.message}
        </p>
      )}
    </div>
  );
}

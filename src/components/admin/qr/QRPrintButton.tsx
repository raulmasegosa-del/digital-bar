"use client";

export default function QRPrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-amber-600 px-5 py-2 font-semibold text-white transition hover:bg-amber-700"
    >
      🖨️ Imprimir
    </button>
  );
}
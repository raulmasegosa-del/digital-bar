"use client";

import { QRCodeSVG } from "qrcode.react";

const TEST_QR_BASE_URL = "https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR";

export default function FiscalInvoiceQr({
  issuerNif,
  invoiceNumber,
  issuedAt,
  totalAmount,
}: {
  issuerNif: string;
  invoiceNumber: string;
  issuedAt: string;
  totalAmount: number;
}) {
  const date = new Date(issuedAt);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const fecha = `${dd}-${mm}-${date.getUTCFullYear()}`;
  const params = new URLSearchParams({
    nif: issuerNif,
    numserie: invoiceNumber,
    fecha,
    importe: totalAmount.toFixed(2),
  });
  const qrUrl = `${TEST_QR_BASE_URL}?${params.toString()}`;

  return (
    <div className="mt-4 flex items-start gap-4 rounded-lg border bg-white p-4">
      <div className="shrink-0">
        <QRCodeSVG value={qrUrl} size={140} level="M" includeMargin />
      </div>
      <div className="min-w-0 text-xs text-gray-600">
        <div className="font-semibold text-gray-900">QR tributario · entorno de pruebas</div>
        <div className="mt-1 font-medium">VERI*FACTU</div>
        <div className="mt-2 break-all">{qrUrl}</div>
        <div className="mt-2 text-gray-500">El QR usa la URL de cotejo de pruebas de AEAT y los cuatro parámetros fiscales exigidos: NIF, número/serie, fecha e importe.</div>
      </div>
    </div>
  );
}

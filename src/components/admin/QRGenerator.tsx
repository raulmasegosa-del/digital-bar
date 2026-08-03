"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export default function QRGenerator() {
  const [tables, setTables] = useState(10);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <label className="font-semibold">
          Número de mesas
        </label>

        <input
          type="number"
          min={1}
          value={tables}
          onChange={(e) =>
            setTables(Number(e.target.value))
          }
          className="w-24 rounded-lg border p-2"
        />

        <button
          onClick={() => window.print()}
          className="rounded-lg bg-amber-600 px-5 py-2 font-semibold text-white hover:bg-amber-700"
        >
          🖨️ Imprimir
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-4">
        {Array.from({ length: tables }).map((_, index) => {
          const table = index + 1;

          const url =
            `${APP_URL}/?mesa=${table}`;

          return (
            <div
              key={table}
              className="flex flex-col items-center rounded-xl border bg-white p-6 shadow"
            >
              <QRCodeSVG
                value={url}
                size={180}
              />

              <h2 className="mt-4 text-xl font-bold">
                Mesa {table}
              </h2>

              <p className="mt-1 text-center text-xs text-gray-500 break-all">
                {url}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
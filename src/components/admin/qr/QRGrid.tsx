"use client";

import { useState } from "react";

import QRCard from "./QRCard";
import QRPrintButton from "./QRPrintButton";

export default function QRGrid() {
  const [tables, setTables] = useState(10);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
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

        <QRPrintButton />
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4 print:grid-cols-4">
        {Array.from({ length: tables }).map((_, index) => (
          <QRCard
            key={index}
            table={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
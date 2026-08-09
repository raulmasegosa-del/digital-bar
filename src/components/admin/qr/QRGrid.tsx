"use client";

import { useState } from "react";

import QRCard from "./QRCard";
import QRPrintButton from "./QRPrintButton";

type Props = {
  slug: string;
};

export default function QRGrid({
  slug,
}: Props) {
  const [tables, setTables] = useState(10);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="font-medium">
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
        </div>

        <QRPrintButton />
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4 print:grid-cols-4">
        {Array.from({ length: tables }).map((_, index) => (
          <QRCard
            key={index}
            slug={slug}
            table={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
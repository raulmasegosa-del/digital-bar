"use client";

import QRCard from "./QRCard";
import QRPrintButton from "./QRPrintButton";
import InvalidateQrsButton from "./InvalidateQrsButton";

type Table = {
  number: number;
  name: string | null;
  zone: string | null;
  qrToken: string | null;
};

type Props = {
  restaurantId: string;
  slug: string;
  tables: Table[];
};

export default function QRGrid({ restaurantId, slug, tables }: Props) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#181716] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            {tables.length === 1 ? "1 mesa" : `${tables.length} mesas`} configuradas
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Los QR corresponden a las mesas reales de este restaurante.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <QRPrintButton />
          <InvalidateQrsButton restaurantId={restaurantId} slug={slug} />
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181716] px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-white">No hay mesas configuradas</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Crea las mesas del restaurante para poder generar sus códigos QR.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 print:grid-cols-4">
          {tables.map((table) => (
            <QRCard
              key={table.number}
              slug={slug}
              table={table.number}
              name={table.name}
              zone={table.zone}
              qrToken={table.qrToken}
            />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { QRCodeSVG } from "qrcode.react";

import { getTableUrl } from "@/lib/qr/getTableUrl";

type Props = {
  slug: string;
  table: number;
};

export default function QRCard({
  slug,
  table,
}: Props) {
  const url = getTableUrl(slug, table);

  return (
    <article className="rounded-2xl border bg-white p-6 shadow">
      <div className="text-center">
        <h3 className="text-xl font-bold">
          🍻 Digital Bar
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Escanea para pedir
        </p>
      </div>

      <div className="my-6 flex justify-center">
        <QRCodeSVG
          value={url}
          size={180}
          includeMargin
        />
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold">
          Mesa {table}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Escanea este código para acceder a la carta.
        </p>
      </div>
    </article>
  );
}
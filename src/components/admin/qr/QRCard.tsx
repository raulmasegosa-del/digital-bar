"use client";

import { QRCodeSVG } from "qrcode.react";

import { getTableUrl } from "@/lib/qr/getTableUrl";

type Props = {
  table: number;
};

export default function QRCard({
  table,
}: Props) {
  const url = getTableUrl(table);

  return (
    <article
      className="
        rounded-2xl
        border-2
        border-gray-800
        bg-white
        p-6
        shadow
        print:shadow-none
      "
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          🍻 Digital Bar
        </h2>

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
          Escanea este código para
          acceder a la carta.
        </p>
      </div>
    </article>
  );
}

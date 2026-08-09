"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  slug: string;
  table: number;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://digital-bar-orpin.vercel.app";

export default function QRCard({
  slug,
  table,
}: Props) {
  const url = `${APP_URL}/r/${slug}?mesa=${table}`;

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

        <p className="mt-2 break-all text-sm text-gray-500">
          {url}
        </p>
      </div>
    </article>
  );
}
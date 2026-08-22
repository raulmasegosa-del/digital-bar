"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  slug: string;
  table: number;
  name?: string | null;
  zone?: string | null;
  qrToken?: string | null;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://digital-bar-orpin.vercel.app";

const LOGO_URL = `${APP_URL}/brand/digital-bar-logo.png`;

export default function QRCard({
  slug,
  table,
  name,
  zone,
}: Props) {
  // El QR físico es permanente. La sesión temporal y su token se crean
  // cuando el cliente escanea este QR, por lo que pagar nunca invalida el QR.
  const url = `${APP_URL}/r/${slug}?mesa=${table}`;

  return (
    <article className="rounded-2xl border border-zinc-800 bg-[#181716] p-6 text-white shadow-sm print:border-zinc-300 print:bg-white print:text-black">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm">
          <img src={LOGO_URL} alt="Digital Bar" className="h-full w-full object-contain" />
        </div>
        <h3 className="text-xl font-semibold">Digital Bar</h3>
        <p className="mt-1 text-sm text-zinc-500 print:text-gray-500">
          {name || `Mesa ${table}`}
        </p>
        {zone && (
          <p className="mt-1 text-xs text-zinc-600 print:text-gray-500">{zone}</p>
        )}
      </div>

      <div className="my-6 flex justify-center rounded-xl bg-white p-4">
        <QRCodeSVG
          value={url}
          size={180}
          includeMargin
          level="H"
          imageSettings={{
            src: LOGO_URL,
            height: 42,
            width: 42,
            excavate: true,
            opacity: 1,
          }}
        />
      </div>

      <div className="text-center">
        <p className="text-3xl font-semibold">Mesa {table}</p>
        <p className="mt-2 text-sm font-semibold tracking-wide text-zinc-300 print:text-gray-700">
          digitalbar.app
        </p>
        <p className="mt-1 text-xs text-zinc-500 print:text-gray-500">
          Escanea para pedir
        </p>
      </div>
    </article>
  );
}

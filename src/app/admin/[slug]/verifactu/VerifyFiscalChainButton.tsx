"use client";

import { useState } from "react";
import { verifyFiscalChain, type FiscalChainVerification } from "./verifyFiscalChain";

export default function VerifyFiscalChainButton({ slug }: { slug: string }) {
  const [result, setResult] = useState<FiscalChainVerification | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    try {
      setResult(await verifyFiscalChain(slug));
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo validar la cadena.",
        checked: 0,
        recomputed: 0,
        legacy: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading}
        className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Validando…" : "🔐 Verificar integridad de la cadena"}
      </button>
      {result && (
        <div className={`rounded-lg border p-4 text-sm ${result.ok ? "" : "border-red-300"}`}>
          <div className="font-semibold">{result.ok ? "✅ Cadena íntegra" : "❌ Cadena con incidencias"}</div>
          <div className="mt-1">{result.message}</div>
          <div className="mt-2 text-xs text-gray-500">
            Registros comprobados: {result.checked} · Hashes recalculados: {result.recomputed} · Registros antiguos sin hash_input: {result.legacy}
          </div>
        </div>
      )}
    </div>
  );
}

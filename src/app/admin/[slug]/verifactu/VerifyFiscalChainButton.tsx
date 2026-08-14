"use client";

import { useState } from "react";
import {
  simulateFiscalChainCorruption,
  verifyFiscalChain,
  type FiscalChainVerification,
} from "./verifyFiscalChain";

export default function VerifyFiscalChainButton({ slug }: { slug: string }) {
  const [result, setResult] = useState<FiscalChainVerification | null>(null);
  const [simulation, setSimulation] = useState<FiscalChainVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);

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

  async function handleSimulation() {
    setSimulationLoading(true);
    try {
      setSimulation(await simulateFiscalChainCorruption(slug));
    } catch (error) {
      setSimulation({
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo ejecutar la simulación.",
        checked: 0,
        recomputed: 0,
        legacy: 0,
      });
    } finally {
      setSimulationLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || simulationLoading}
          className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Validando…" : "🔐 Verificar integridad de la cadena"}
        </button>
        <button
          type="button"
          onClick={handleSimulation}
          disabled={loading || simulationLoading}
          className="rounded-lg border border-dashed px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {simulationLoading ? "Simulando…" : "🧪 Simular corrupción (no modifica datos)"}
        </button>
      </div>

      {result && (
        <div className={`rounded-lg border p-4 text-sm ${result.ok ? "" : "border-red-300"}`}>
          <div className="font-semibold">{result.ok ? "✅ Cadena íntegra" : "❌ Cadena con incidencias"}</div>
          <div className="mt-1">{result.message}</div>
          <div className="mt-2 text-xs text-gray-500">
            Registros comprobados: {result.checked} · Hashes recalculados: {result.recomputed} · Registros antiguos sin hash_input: {result.legacy}
          </div>
        </div>
      )}

      {simulation && (
        <div className="rounded-lg border border-amber-300 p-4 text-sm">
          <div className="font-semibold">🧪 Resultado de simulación</div>
          <div className="mt-1">{simulation.message}</div>
          <div className="mt-2 text-xs text-gray-500">
            Registros comprobados: {simulation.checked} · Hashes recalculados: {simulation.recomputed} · Registros antiguos sin hash_input: {simulation.legacy}
          </div>
          <div className="mt-2 text-xs text-gray-500">La simulación modifica únicamente una copia en memoria; no escribe en Supabase.</div>
        </div>
      )}
    </div>
  );
}

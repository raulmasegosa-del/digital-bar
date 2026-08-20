"use client";

import { useState } from "react";
import { useTable } from "@/context/TableContext";
import { useToast } from "@/context/ToastContext";
import { createServiceCall } from "@/lib/db/restaurants/service/createServiceCall";

type Props = { restaurantId: string };

export default function WaiterActions({ restaurantId }: Props) {
  const { table, sessionToken, sessionError } = useTable();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showWaiterDialog, setShowWaiterDialog] = useState(false);
  const [description, setDescription] = useState("");
  const canCall = Boolean(table && sessionToken && restaurantId);

  async function sendCall(type: "waiter" | "bill", waiterDescription = "") {
    if (!table) return showToast("⚠️ No se ha detectado la mesa.");
    if (!sessionToken) return showToast(sessionError || "⚠️ La sesión de la mesa no está activa. Lee de nuevo el QR.");
    if (!restaurantId) return showToast("⚠️ No se ha identificado el restaurante.");
    try {
      setLoading(true);
      await createServiceCall({ restaurantId, table, type, description: type === "waiter" ? waiterDescription : "" });
      setDescription("");
      setShowWaiterDialog(false);
      showToast(type === "waiter" ? `🙋 Camarero avisado para la mesa ${table}` : `💶 Cuenta solicitada para la mesa ${table}`);
    } catch (error) {
      console.error("No se pudo crear el aviso de servicio", error);
      showToast(type === "waiter" ? "❌ No se pudo avisar al camarero." : "❌ No se pudo solicitar la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setShowWaiterDialog(true)} disabled={loading || !canCall} className="rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">🙋 Llamar al camarero</button>
        <button type="button" onClick={() => void sendCall("bill")} disabled={loading || !canCall} title={!canCall ? "Espera a que se abra la sesión de la mesa" : "Pedir la cuenta"} className="rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">💶 Pedir la cuenta</button>
      </div>
      {showWaiterDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#1a1917] p-5 shadow-2xl sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">Avisar al camarero</p>
            <h2 className="mt-2 text-2xl font-black text-white">¿Qué necesita?</h2>
            <p className="mt-2 text-sm text-zinc-400">Puedes indicar qué necesitas o avisar sin escribir nada.</p>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ej.: necesitamos dos vasos, una servilleta..." maxLength={300} rows={4} autoFocus className="mt-5 w-full resize-none rounded-xl border border-zinc-700 bg-[#11100f] px-4 py-3 text-base text-white outline-none placeholder:text-zinc-600 focus:border-sky-500" />
            <p className="mt-1 text-right text-[11px] text-zinc-600">{description.length}/300</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setDescription(""); setShowWaiterDialog(false); }} disabled={loading} className="min-h-12 rounded-xl border border-zinc-700 bg-zinc-800/70 px-4 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-50">Cancelar</button>
              <button type="button" onClick={() => void sendCall("waiter", description)} disabled={loading} className="min-h-12 rounded-xl bg-sky-600 px-4 py-3 font-bold text-white hover:bg-sky-500 disabled:opacity-50">{loading ? "Enviando…" : "Avisar al camarero"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

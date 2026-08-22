"use client";

import { useActionState } from "react";
import { saveFiscalConfiguration, type FiscalConfigurationState } from "./actions";

type Props = {
  slug: string;
  initial: {
    fiscalName: string;
    fiscalNif: string;
    fiscalAddress: string;
    fiscalPostalCode: string;
    fiscalCity: string;
    testSeries: string;
    testNextNumber: number | null;
  };
};

const initialState: FiscalConfigurationState = { ok: false, message: "" };

export default function FiscalConfigurationForm({ slug, initial }: Props) {
  const [state, action, pending] = useActionState(saveFiscalConfiguration, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Razón social / nombre fiscal</span>
          <input name="fiscalName" defaultValue={initial.fiscalName} placeholder="Ej.: Restaurante El Tapeo, S.L." required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">NIF</span>
          <input name="fiscalNif" defaultValue={initial.fiscalNif} placeholder="Ej.: B12345678" required className="w-full rounded-lg border px-3 py-2 uppercase" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm font-medium">Domicilio fiscal</span>
          <input name="fiscalAddress" defaultValue={initial.fiscalAddress} placeholder="Ej.: Calle Mayor, 25, 1º" required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Código postal</span>
          <input name="fiscalPostalCode" defaultValue={initial.fiscalPostalCode} placeholder="Ej.: 28001" className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Ciudad</span>
          <input name="fiscalCity" defaultValue={initial.fiscalCity} placeholder="Ej.: Madrid" className="w-full rounded-lg border px-3 py-2" />
        </label>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4 space-y-4">
        <div>
          <h3 className="font-semibold">Serie de pruebas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Esta configuración es sólo para pruebas. No se crea ninguna serie ni se cambia la numeración hasta que pulses Guardar.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Serie</span>
            <input name="testSeries" defaultValue={initial.testSeries} placeholder="Ej.: T" maxLength={20} className="w-full rounded-lg border bg-white px-3 py-2 uppercase" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Próximo número</span>
            <input name="testNextNumber" type="number" min={1} defaultValue={initial.testNextNumber ?? ""} placeholder="Ej.: 1" className="w-full rounded-lg border bg-white px-3 py-2" />
          </label>
        </div>
        <p className="text-xs text-gray-500">El número debe introducirse expresamente; Digital Bar no lo deduce de facturas anteriores.</p>
      </div>

      {state.message && (
        <p className={`rounded-lg p-3 text-sm ${state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white disabled:opacity-50">
        {pending ? "Guardando…" : "Guardar configuración fiscal"}
      </button>
    </form>
  );
}

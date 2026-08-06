"use client";

import { useState } from "react";

import { useTable } from "@/context/TableContext";
import { useToast } from "@/context/ToastContext";

import { createServiceCall } from "@/lib/service/createServiceCall";

export default function WaiterActions() {
  const { table } = useTable();
  const { showToast } = useToast();

  const [loading, setLoading] =
    useState(false);
async function sendCall(
  type: "waiter" | "bill"
) {
  if (!table) {
    showToast("⚠️ No se ha detectado la mesa.");
    return;
  }

  try {
    setLoading(true);

    await createServiceCall({
      table,
      type,
    });

    showToast(
      type === "waiter"
        ? `🙋 Camarero avisado para la mesa ${table}`
        : `💶 Cuenta solicitada para la mesa ${table}`
    );
  } catch {
    showToast(
      type === "waiter"
        ? "❌ No se pudo avisar al camarero."
        : "❌ No se pudo solicitar la cuenta."
    );
  } finally {
    setLoading(false);
  }
}
  async function callWaiter() {
    if (!table) {
      showToast("⚠️ No se ha detectado la mesa.");
      return;
    }

    try {
      setLoading(true);

      await createServiceCall({
        table,
        type: "waiter",
      });

      showToast(
        `🙋 Camarero avisado para la mesa ${table}`
      );
    } catch {
      showToast(
        "❌ No se pudo avisar al camarero."
      );
    } finally {
      setLoading(false);
    }
  }

  async function requestBill() {
    if (!table) {
      showToast("⚠️ No se ha detectado la mesa.");
      return;
    }

    try {
      setLoading(true);

      await createServiceCall({
        table,
        type: "bill",
      });

      showToast(
        `💶 Cuenta solicitada para la mesa ${table}`
      );
    } catch {
      showToast(
        "❌ No se pudo solicitar la cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 grid grid-cols-2 gap-3">
      <button
        onClick={callWaiter}
        disabled={loading}
        className="rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        🙋 Llamar al camarero
      </button>

      <button
        onClick={requestBill}
        disabled={loading}
        className="rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        💶 Pedir la cuenta
      </button>
    </div>
  );
}
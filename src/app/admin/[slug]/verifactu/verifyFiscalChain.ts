"use server";

import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

const TEST_SERIES = "T";

export type FiscalChainVerification = {
  ok: boolean;
  message: string;
  checked: number;
  recomputed: number;
  legacy: number;
};

export async function verifyFiscalChain(slug: string): Promise<FiscalChainVerification> {
  const restaurant = await getRestaurant(slug);
  if (!restaurant) throw new Error("Restaurante no encontrado");

  const { data: records, error } = await supabaseAdmin
    .from("fiscal_records")
    .select("invoice_number, invoice_type, generated_at, hash, previous_hash, hash_input, environment, record_type")
    .eq("restaurant_id", restaurant.id)
    .eq("environment", "test")
    .eq("record_type", "alta")
    .like("invoice_number", `${TEST_SERIES}-%`)
    .order("generated_at", { ascending: true });

  if (error) throw error;

  const rows = records ?? [];
  if (!rows.length) {
    return { ok: true, message: "No hay registros de prueba que validar.", checked: 0, recomputed: 0, legacy: 0 };
  }

  let recomputed = 0;
  let legacy = 0;
  const problems: string[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const current = rows[index];
    const expectedNumber = `${TEST_SERIES}-${String(index + 1).padStart(6, "0")}`;

    if (current.invoice_number !== expectedNumber) {
      problems.push(`${current.invoice_number}: numeración esperada ${expectedNumber}`);
    }

    const previous = index > 0 ? rows[index - 1] : null;
    if (!previous) {
      if (current.previous_hash !== null) problems.push(`${current.invoice_number}: el primer registro tiene previous_hash`);
    } else if (current.previous_hash !== previous.hash) {
      problems.push(`${current.invoice_number}: previous_hash no coincide con ${previous.invoice_number}`);
    }

    if (index > 0 && new Date(current.generated_at).getTime() < new Date(previous.generated_at).getTime()) {
      problems.push(`${current.invoice_number}: generated_at anterior al registro previo`);
    }

    const canonical = (current.hash_input as { canonical?: unknown } | null)?.canonical;
    if (typeof canonical === "string" && canonical.length > 0) {
      const recalculated = crypto.createHash("sha256").update(canonical, "utf8").digest("hex").toUpperCase();
      recomputed += 1;
      if (recalculated !== current.hash) {
        problems.push(`${current.invoice_number}: hash almacenado no coincide con hash recalculado`);
      }
    } else {
      legacy += 1;
    }
  }

  if (problems.length) {
    return {
      ok: false,
      message: `Cadena NO íntegra: ${problems.join(" · ")}`,
      checked: rows.length,
      recomputed,
      legacy,
    };
  }

  const legacyMessage = legacy ? ` ${legacy} registro(s) antiguo(s) sin hash_input verificable.` : "";
  return {
    ok: true,
    message: `Cadena íntegra: ${rows.length} registro(s) encadenado(s).${legacyMessage}`,
    checked: rows.length,
    recomputed,
    legacy,
  };
}

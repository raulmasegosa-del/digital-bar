"use server";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";
import { supabaseAdmin } from "@/lib/supabase/server";

export type FiscalConfigurationState = {
  ok: boolean;
  message: string;
};

export async function saveFiscalConfiguration(
  _previousState: FiscalConfigurationState,
  formData: FormData,
): Promise<FiscalConfigurationState> {
  try {
    const slug = String(formData.get("slug") ?? "").trim();
    const restaurant = await getRestaurant(slug);
    if (!restaurant) return { ok: false, message: "Restaurante no encontrado." };

    const fiscalName = String(formData.get("fiscalName") ?? "").trim();
    const fiscalNif = String(formData.get("fiscalNif") ?? "").trim().toUpperCase();
    const fiscalAddress = String(formData.get("fiscalAddress") ?? "").trim();
    const fiscalPostalCode = String(formData.get("fiscalPostalCode") ?? "").trim();
    const fiscalCity = String(formData.get("fiscalCity") ?? "").trim();
    const testSeries = String(formData.get("testSeries") ?? "").trim().toUpperCase();
    const nextNumberRaw = String(formData.get("testNextNumber") ?? "").trim();
    const nextNumber = Number(nextNumberRaw);

    if (!fiscalName || !fiscalNif || !fiscalAddress) {
      return { ok: false, message: "Completa razón social, NIF y domicilio fiscal." };
    }

    if (!testSeries || !Number.isInteger(nextNumber) || nextNumber < 1) {
      return { ok: false, message: "Indica una serie de pruebas y un próximo número válido." };
    }

    const { error: settingsError } = await supabaseAdmin
      .from("restaurant_settings")
      .update({
        fiscal_name: fiscalName,
        fiscal_nif: fiscalNif,
        fiscal_address: fiscalAddress,
        fiscal_postal_code: fiscalPostalCode || null,
        fiscal_city: fiscalCity || null,
        updated_at: new Date().toISOString(),
      })
      .eq("restaurant_id", restaurant.id);

    if (settingsError) throw settingsError;

    const { data: existingSeries, error: seriesReadError } = await supabaseAdmin
      .from("fiscal_series")
      .select("id, next_number")
      .eq("restaurant_id", restaurant.id)
      .eq("series", testSeries)
      .eq("environment", "test")
      .maybeSingle();

    if (seriesReadError) throw seriesReadError;

    if (existingSeries) {
      if (Number(existingSeries.next_number) !== nextNumber) {
        const { error } = await supabaseAdmin
          .from("fiscal_series")
          .update({ next_number: nextNumber, updated_at: new Date().toISOString() })
          .eq("id", existingSeries.id);
        if (error) throw error;
      }
    } else {
      const { error } = await supabaseAdmin
        .from("fiscal_series")
        .insert({
          restaurant_id: restaurant.id,
          series: testSeries,
          environment: "test",
          next_number: nextNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    }

    return { ok: true, message: "Configuración fiscal guardada correctamente." };
  } catch (error) {
    console.error("Fiscal configuration error", error);
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la configuración." };
  }
}

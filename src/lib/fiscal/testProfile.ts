import type { FiscalRestaurantProfile } from "@/lib/fiscal/types";

/**
 * Fictional fiscal profile used only while developing and testing the
 * VERI*FACTU integration. It must never be used for real invoices.
 */
export const FISCAL_TEST_PROFILE: FiscalRestaurantProfile = {
  mode: "test",
  legal_name: "DIGITAL BAR TEST",
  tax_id: "B00000000",
  address: "Calle de Pruebas 1",
  postal_code: "08001",
  city: "Barcelona",
  province: "Barcelona",
  country: "ES",
  default_series: {
    series: "T",
    next_number: 1,
  },
  verifactu_enabled: false,
};

export function getFiscalRestaurantProfile(): FiscalRestaurantProfile {
  return FISCAL_TEST_PROFILE;
}

"use client";

import { saveRestaurantSettings } from "@/lib/actions/settings";
import PrimaryButton from "@/components/ui/form/PrimaryButton";
import type { RestaurantSettings } from "@/types/settings";

import RestaurantSection from "@/components/admin/settings/RestaurantSection";
import ContactSection from "@/components/admin/settings/ContactSection";
import AppearanceSection from "@/components/admin/settings/AppearanceSection";
import OperationSection from "@/components/admin/settings/OperationSection";

type Props = {
  settings: RestaurantSettings;
};

export default function SettingsForm({
  settings,
}: Props) {
  return (
    <form
      action={saveRestaurantSettings}
      className="space-y-8"
    >
      <RestaurantSection settings={settings} />

      <ContactSection settings={settings} />

      <AppearanceSection settings={settings} />

      <OperationSection settings={settings} />

      <div className="flex justify-end">
  <button
    type="submit"
    className="
      rounded-2xl
      bg-amber-600
      px-8
      py-3
      font-semibold
      text-white
      transition
      hover:bg-amber-700
    "
  >
    Guardar cambios
  </button>
</div>
    </form>
  );
}
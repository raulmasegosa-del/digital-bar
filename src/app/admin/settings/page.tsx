import PageHeader from "@/components/ui/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

import { getRestaurantSettings } from "@/lib/db/settings";

export default async function SettingsPage() {
  const settings =
    await getRestaurantSettings();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader
        title="Configuración"
        description="Personaliza Digital Bar para adaptarlo a tu restaurante."
      />

      <SettingsForm
        settings={settings}
      />
    </main>
  );
}
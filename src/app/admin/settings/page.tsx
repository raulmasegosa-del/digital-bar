import SettingsForm from "@/components/admin/SettingsForm";
import { getRestaurantSettings } from "@/lib/db/settings";

export default async function SettingsPage() {
  const settings = await getRestaurantSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <SettingsForm settings={settings} />

      <div className="rounded-xl border bg-gray-50 p-6">
        <h3 className="mb-3 text-lg font-bold">
          Datos cargados desde Supabase
        </h3>

        <pre className="overflow-x-auto text-sm">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
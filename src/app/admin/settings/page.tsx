import { getRestaurantSettings } from "@/lib/db/settings";

export default async function SettingsPage() {
  const settings = await getRestaurantSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          Configuración del restaurante
        </h1>

        <p className="mt-2 text-gray-600">
          Datos generales del negocio.
        </p>
      </div>

      <pre className="overflow-auto rounded-xl bg-gray-900 p-6 text-sm text-green-400">
        {JSON.stringify(settings, null, 2)}
      </pre>
    </div>
  );
}
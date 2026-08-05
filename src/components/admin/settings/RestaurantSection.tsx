import Card from "@/components/ui/Card";
import TextInput from "@/components/ui/form/TextInput";
import TextareaField from "@/components/ui/form/TextareaField";

import type { RestaurantSettings } from "@/types/settings";

type Props = {
  settings: RestaurantSettings;
};

export default function RestaurantSection({
  settings,
}: Props) {
  return (
    <Card className="p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Restaurante
        </h2>

        <p className="text-gray-500">
          Información principal del negocio.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <TextInput
          label="Nombre"
          name="name"
          defaultValue={settings.name}
        />

        <TextareaField
          label="Descripción"
          name="description"
          rows={4}
          defaultValue={settings.description}
        />

        <TextInput
          label="Logo (URL)"
          name="logo"
          defaultValue={settings.logo}
          helperText="Más adelante podrás subir una imagen directamente."
        />
      </div>
    </Card>
  );
}
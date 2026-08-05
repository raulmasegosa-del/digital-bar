import Card from "@/components/ui/Card";
import ColorPicker from "@/components/ui/form/ColorPicker";

import type { RestaurantSettings } from "@/types/settings";

import { Palette } from "lucide-react";

type Props = {
  settings: RestaurantSettings;
};

export default function AppearanceSection({
  settings,
}: Props) {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-amber-600" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Apariencia
          </h2>

          <p className="mt-1 text-gray-500">
            Personaliza la identidad visual del restaurante.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ColorPicker
          name="primary_color"
          label="Color principal"
          defaultValue={settings.primary_color}
          helperText="Este color se utilizará como color principal del restaurante."
        />
      </div>
    </Card>
  );
  }
import Card from "@/components/ui/Card";
import Switch from "@/components/ui/form/Switch";

import type { RestaurantSettings } from "@/types/settings";

import { Settings2 } from "lucide-react";

type Props = {
  settings: RestaurantSettings;
};

export default function OperationSection({
  settings,
}: Props) {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <Settings2 className="h-6 w-6 text-amber-600" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Operación
          </h2>

          <p className="mt-1 text-gray-500">
            Configura el comportamiento del restaurante.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Switch
          name="accept_orders"
          label="Aceptar pedidos"
          description="Permite que los clientes puedan seguir realizando pedidos."
          defaultChecked={settings.accept_orders}
        />
      </div>
    </Card>
  );
}
import Card from "@/components/ui/Card";
import TextInput from "@/components/ui/form/TextInput";

import type { RestaurantSettings } from "@/types/settings";

import { Phone } from "lucide-react";

type Props = {
  settings: RestaurantSettings;
};

export default function ContactSection({
  settings,
}: Props) {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <Phone className="h-6 w-6 text-amber-600" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Contacto
          </h2>

          <p className="mt-1 text-gray-500">
            Datos que verán los clientes.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TextInput
          label="Teléfono"
          name="phone"
          defaultValue={settings.phone}
        />

        <TextInput
          label="WhatsApp"
          name="whatsapp"
          defaultValue={settings.whatsapp}
        />

        <TextInput
          label="Email"
          name="email"
          type="email"
          defaultValue={settings.email}
          className="md:col-span-2"
        />

        <TextInput
          label="Dirección"
          name="address"
          defaultValue={settings.address}
          className="md:col-span-2"
        />
      </div>
    </Card>
  );
}
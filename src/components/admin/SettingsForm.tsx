"use client";

import { saveRestaurantSettings } from "@/app/admin/settings/actions";
import type { RestaurantSettings } from "@/types/settings";

type Props = {
  settings: RestaurantSettings;
};

export default function SettingsForm({
  settings,
}: Props) {
  return (
    <form
      action={saveRestaurantSettings}
      className="space-y-8 rounded-2xl bg-white p-8 shadow"
    >
      <div>
        <h2 className="text-3xl font-bold">
          Configuración del restaurante
        </h2>

        <p className="mt-2 text-gray-500">
          Modifica la información general del negocio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold">
            Nombre
          </label>

          <input
            name="name"
            defaultValue={settings.name}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Teléfono
          </label>

          <input
            name="phone"
            defaultValue={settings.phone}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            WhatsApp
          </label>

          <input
            name="whatsapp"
            defaultValue={settings.whatsapp}
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Email
          </label>

          <input
            type="email"
            name="email"
            defaultValue={settings.email}
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Dirección
        </label>

        <input
          name="address"
          defaultValue={settings.address}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Logo (URL)
        </label>

        <input
          name="logo"
          defaultValue={settings.logo}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Descripción
        </label>

        <textarea
          name="description"
          rows={4}
          defaultValue={settings.description}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Color principal
        </label>

        <input
          type="color"
          name="primary_color"
          defaultValue={settings.primary_color}
          className="h-12 w-20 rounded-lg border"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="accept_orders"
          type="checkbox"
          name="accept_orders"
          defaultChecked={settings.accept_orders}
        />

        <label
          htmlFor="accept_orders"
          className="font-semibold"
        >
          Aceptar pedidos
        </label>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700"
      >
        💾 Guardar cambios
      </button>
    </form>
  );
}
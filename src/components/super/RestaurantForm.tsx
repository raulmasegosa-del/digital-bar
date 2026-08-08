"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createRestaurant } from "@/app/super/actions";

import TextInput from "@/components/ui/form/TextInput";
import Switch from "@/components/ui/form/Switch";
import PrimaryButton from "@/components/ui/form/PrimaryButton";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function RestaurantForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold">
        Nuevo restaurante
      </h1>

      <form
        action={createRestaurant}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Nombre
          </label>

          <input
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Slug
          </label>

          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <TextInput
          label="Número de mesas"
          name="tables"
          type="number"
          min="1"
          defaultValue="20"
        />

        <Switch
          name="generateQr"
          label="Generar QR automáticamente"
          defaultChecked
        />

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link href="/super/restaurants">
            <button
              type="button"
              className="rounded-xl border px-5 py-2 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
          </Link>

          <PrimaryButton type="submit">
            🍽 Crear restaurante
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
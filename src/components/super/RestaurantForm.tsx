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
    <section className="rounded-2xl border border-zinc-800 bg-[#181716] p-6 shadow-sm sm:p-8">
      <form action={createRestaurant} className="space-y-6">
        <TextInput
          label="Nombre del restaurante"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Niko's Picapollo"
        />

        <TextInput
          label="Slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
          placeholder="niko-s-picapollo"
          helperText="Se usa para la URL pública del restaurante."
        />

        <TextInput
          label="🌐 Sitio web"
          name="website"
          type="url"
          placeholder="https://www.mirestaurante.com"
        />

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

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/super/restaurants"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            Cancelar
          </Link>

          <PrimaryButton type="submit">
            🍽 Crear restaurante
          </PrimaryButton>
        </div>
      </form>
    </section>
  );
}

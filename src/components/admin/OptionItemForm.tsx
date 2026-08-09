"use client";

import Link from "next/link";
import { useState } from "react";

import {
  createOptionGroup,
  updateOptionGroup,
} from "@/app/admin/option-group-actions";

import OptionItemsEditor, {
  OptionItem,
} from "./OptionItemsEditor";

type OptionGroup = {
  id?: string;
  name?: string;
  description?: string | null;
  required?: boolean;
  multiple?: boolean;
  min_select?: number;
  max_select?: number;
  order?: number;
};

type Props = {
  item?: OptionGroup;
  slug: string;
  restaurantId: string;
};

export default function OptionForm({
  item,
  slug,
  restaurantId,
}: Props) {
  const group = item ?? {
    name: "",
    description: "",
    required: false,
    multiple: false,
    min_select: 0,
    max_select: 1,
    order: 0,
  };

  const [items, setItems] = useState<OptionItem[]>([]);

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold">
        {item
          ? "Editar grupo de opciones"
          : "Nuevo grupo de opciones"}
      </h1>

      <form
        action={
          item
            ? updateOptionGroup
            : createOptionGroup
        }
        className="space-y-6"
      >
        <input
          type="hidden"
          name="slug"
          value={slug}
        />

        <input
          type="hidden"
          name="restaurant_id"
          value={restaurantId}
        />

        {item?.id && (
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
        )}

        <div>
          <label className="mb-2 block font-semibold">
            Nombre del grupo
          </label>

          <input
            name="name"
            defaultValue={group.name}
            required
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-amber-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Descripción
          </label>

          <textarea
            name="description"
            defaultValue={
              group.description ?? ""
            }
            rows={3}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-amber-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="required"
              defaultChecked={
                group.required
              }
            />

            Obligatorio
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="multiple"
              defaultChecked={
                group.multiple
              }
            />

            Permitir varias selecciones
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mínimo
            </label>

            <input
              type="number"
              name="min_select"
              defaultValue={group.min_select}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Máximo
            </label>

            <input
              type="number"
              name="max_select"
              defaultValue={group.max_select}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Orden
            </label>

            <input
              type="number"
              name="order"
              defaultValue={group.order}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <OptionItemsEditor
          items={items}
          onChange={setItems}
        />

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href={`/admin/${slug}/options`}
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-6 py-2 font-medium text-white transition hover:bg-amber-700"
          >
            {item
              ? "Guardar cambios"
              : "Crear grupo"}
          </button>
        </div>
      </form>
    </div>
  );
}
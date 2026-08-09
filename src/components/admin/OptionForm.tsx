"use client";

import Link from "next/link";
import { useState } from "react";

import {
  createOptionGroup,
  updateOptionGroup,
} from "@/app/admin/option-group-actions";

type Props = {
  slug: string;
  restaurantId: string;
  initialData?: {
    id?: string;
    name: string;
    description?: string | null;
    required: boolean;
    multiple: boolean;
    min_select?: number;
    max_select?: number;
    order?: number;
  };
};

export default function OptionForm({
  slug,
  restaurantId,
  initialData,
}: Props) {
  const [name, setName] = useState(
    initialData?.name ?? ""
  );

  const [description, setDescription] =
    useState(
      initialData?.description ?? ""
    );

  const [required, setRequired] = useState(
    initialData?.required ?? false
  );

  const [multiple, setMultiple] = useState(
    initialData?.multiple ?? false
  );

  const [minSelect, setMinSelect] =
    useState(
      initialData?.min_select ?? 0
    );

  const [maxSelect, setMaxSelect] =
    useState(
      initialData?.max_select ?? 1
    );

  const [order, setOrder] = useState(
    initialData?.order ?? 0
  );

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-8 text-3xl font-bold">
        {initialData
          ? "Editar grupo de opciones"
          : "Nuevo grupo de opciones"}
      </h1>

      <form
        action={
          initialData
            ? updateOptionGroup
            : createOptionGroup
        }
        className="space-y-6"
      >
        {initialData?.id && (
          <input
            type="hidden"
            name="id"
            value={initialData.id}
          />
        )}

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

        <div>
          <label className="mb-2 block font-medium">
            Nombre
          </label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Descripción
          </label>

          <textarea
            name="description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={3}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium">
              Mínimo
            </label>

            <input
              type="number"
              name="min_select"
              min={0}
              value={minSelect}
              onChange={(e) =>
                setMinSelect(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Máximo
            </label>

            <input
              type="number"
              name="max_select"
              min={1}
              value={maxSelect}
              onChange={(e) =>
                setMaxSelect(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Orden
            </label>

            <input
              type="number"
              name="order"
              value={order}
              onChange={(e) =>
                setOrder(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="required"
              checked={required}
              onChange={(e) =>
                setRequired(e.target.checked)
              }
            />

            Obligatorio
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="multiple"
              checked={multiple}
              onChange={(e) =>
                setMultiple(e.target.checked)
              }
            />

            Permitir varias selecciones
          </label>
        </div>

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
            {initialData
              ? "Guardar cambios"
              : "Crear grupo"}
          </button>
        </div>
      </form>
    </div>
  );
}
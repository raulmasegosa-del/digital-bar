"use client";

import { useState } from "react";
import OptionItemsEditor, {
  OptionItem,
} from "./OptionItemsEditor";
interface OptionFormProps {
  initialData?: {
    id?: string;
    name: string;
    required: boolean;
    multiple: boolean;
  };
}

export default function OptionForm({
  initialData,
}: OptionFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [required, setRequired] = useState(
    initialData?.required ?? false
  );
  const [multiple, setMultiple] = useState(
    initialData?.multiple ?? false
  );
const [items, setItems] = useState<OptionItem[]>([]);
  return (
    <form className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">

      <div>
        <label className="mb-2 block font-semibold">
          Nombre del grupo
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Refresco"
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-amber-500"
        />
      </div>

      <div className="space-y-3">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />

          Obligatorio
        </label>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={multiple}
            onChange={(e) => setMultiple(e.target.checked)}
          />

          Permitir varias selecciones
        </label>

      </div>
<OptionItemsEditor
  items={items}
  onChange={setItems}
/>
      <button
        type="submit"
        className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
      >
        Guardar grupo
      </button>

    </form>
  );
}
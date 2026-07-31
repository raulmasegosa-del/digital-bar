"use client";

import { Trash2, Plus } from "lucide-react";

export interface OptionItem {
  id?: string;
  name: string;
  extra_price: number;
  available: boolean;
}

interface Props {
  items: OptionItem[];
  onChange: (items: OptionItem[]) => void;
}

export default function OptionItemsEditor({
  items,
  onChange,
}: Props) {
  function updateItem(
    index: number,
    field: keyof OptionItem,
    value: string | number | boolean
  ) {
    const copy = [...items];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };

    onChange(copy);
  }

  function addItem() {
    onChange([
      ...items,
      {
        name: "",
        extra_price: 0,
        available: true,
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Opciones
      </h2>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border p-4"
        >
          <input
            value={item.name}
            placeholder="Nombre"
            className="flex-1 rounded-lg border px-3 py-2"
            onChange={(e) =>
              updateItem(index, "name", e.target.value)
            }
          />

          <input
            type="number"
            step="0.01"
            value={item.extra_price}
            className="w-28 rounded-lg border px-3 py-2"
            onChange={(e) =>
              updateItem(
                index,
                "extra_price",
                Number(e.target.value)
              )
            }
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 hover:bg-amber-50"
      >
        <Plus size={18} />
        Añadir opción
      </button>

    </div>
  );
}
import Link from "next/link";
import { Settings2, Trash2 } from "lucide-react";
import type { OptionGroup } from "@/types/options";

type Props = {
  item: OptionGroup;
};

export default function OptionCard({ item }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="mb-6 flex items-start justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            {item.name}
          </h2>

          {item.description && (
            <p className="mt-1 text-gray-500">
              {item.description}
            </p>
          )}
        </div>

        <Settings2
          size={34}
          className="text-amber-500"
        />

      </div>

      <div className="mb-6 space-y-1 text-sm text-gray-500">

        <p>
          Obligatorio:{" "}
          <strong>{item.required ? "Sí" : "No"}</strong>
        </p>

        <p>
          Selección múltiple:{" "}
          <strong>{item.multiple ? "Sí" : "No"}</strong>
        </p>

      </div>

      <div className="flex gap-3">

        <Link
          href={`/admin/options/edit/${item.id}`}
          className="flex-1 rounded-xl bg-amber-600 py-3 text-center font-semibold text-white transition hover:bg-amber-700"
        >
          Editar
        </Link>

        <button
          className="rounded-xl bg-red-600 px-4 text-white hover:bg-red-700"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}
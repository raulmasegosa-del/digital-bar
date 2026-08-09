import Link from "next/link";

import type { AdminOptionGroup } from "@/types/admin";

type Props = {
  group: AdminOptionGroup;
  slug: string;
};

export default function OptionGroupCard({
  group,
  slug,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {group.name}
          </h3>

          <p className="text-sm text-gray-500">
            {group.items?.length ?? 0} opciones
          </p>
        </div>

        <span className="text-4xl">⚙️</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {group.required && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
            Obligatorio
          </span>
        )}

        {group.multiple && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            Múltiple
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <Link
          href={`/admin/${slug}/options/${group.id}`}
          className="flex-1 rounded-lg bg-amber-600 py-2 text-center text-white transition hover:bg-amber-700"
        >
          Editar
        </Link>

        <button
          type="button"
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
import Link from "next/link";
import { getOptionGroups } from "@/lib/db/options";
import OptionGrid from "@/components/admin/OptionGrid";

export default async function OptionsPage() {
  const groups = await getOptionGroups();

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Opciones
          </h1>

          <p className="mt-2 text-gray-500">
            Gestiona los grupos de opciones.
          </p>
        </div>

        <Link
          href="/admin/options/new"
          className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700"
        >
          + Nuevo grupo
        </Link>
      </div>

      <OptionGrid groups={groups} />
    </>
  );
}
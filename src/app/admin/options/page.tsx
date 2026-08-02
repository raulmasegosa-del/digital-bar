import Link from "next/link";
import OptionItemGrid from "@/components/admin/OptionItemGrid";

export const dynamic = "force-dynamic";

export default function OptionsPage() {
  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Opciones
          </h1>

          <p className="mt-1 text-gray-500">
            Gestiona las opciones disponibles para los grupos.
          </p>
        </div>

        <Link
          href="/admin/options/new"
          className="rounded-lg bg-amber-600 px-5 py-3 font-medium text-white transition hover:bg-amber-700"
        >
          + Nueva opción
        </Link>
      </div>

      <OptionItemGrid />
    </main>
  );
}
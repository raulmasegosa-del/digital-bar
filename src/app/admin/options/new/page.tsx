import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import OptionForm from "@/components/admin/OptionForm";
<Link
  href="/admin/options/new"
  className="rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"
>
  Nuevo grupo
</Link>
export default function NewOptionPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Nuevo grupo de opciones
          </h1>

          <p className="mt-2 text-gray-500">
            Crea un grupo para personalizar productos.
          </p>

        </div>

        <Link
          href="/admin/options"
          className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
          Volver
        </Link>

      </div>

      <OptionForm />

    </div>
  );
}
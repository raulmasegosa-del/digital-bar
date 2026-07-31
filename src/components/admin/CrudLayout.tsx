import { ReactNode } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CrudLayoutProps {
  title: string;
  description?: string;

  createHref?: string;
  createLabel?: string;

  children: ReactNode;
}

export default function CrudLayout({
  title,
  description,
  createHref,
  createLabel = "Nuevo",
  children,
}: CrudLayoutProps) {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-stone-800">
            {title}
          </h1>

          {description && (
            <p className="mt-2 text-stone-500">
              {description}
            </p>
          )}

        </div>

        {createHref && (
          <Link
            href={createHref}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-medium text-white transition hover:bg-amber-700"
          >
            <Plus size={18} />
            {createLabel}
          </Link>
        )}

      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {children}
      </div>

    </div>
  );
}
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export default function PageHeader({
  title,
  description,
  backHref = "/admin",
  backLabel = "Panel de control",
}: Props) {
  return (
    <header className="mb-8">
      <Link
        href={backHref}
        className="
          mb-4
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-500
          transition-colors
          hover:text-amber-600
        "
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-gray-400">
          {description}
        </p>
      )}
    </header>
  );
}
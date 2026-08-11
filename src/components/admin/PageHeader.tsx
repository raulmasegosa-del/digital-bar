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
          text-zinc-500
          transition-colors
          hover:text-amber-500
        "
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">
        Carta
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          {description}
        </p>
      )}
    </header>
  );
}
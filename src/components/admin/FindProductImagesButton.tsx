"use client";

import { useTransition } from "react";
import { ImageSearch } from "lucide-react";
import { findMissingProductImages } from "@/app/admin/[slug]/products/actions";

export default function FindProductImagesButton({ slug }: { slug: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await findMissingProductImages(slug);
        window.alert(
          result.updated > 0
            ? `Se han asignado ${result.updated} imágenes.${result.unmatched ? ` ${result.unmatched} productos no tuvieron coincidencia.` : ""}`
            : "No se encontraron coincidencias para los productos sin imagen."
        );
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "No se pudieron buscar las imágenes.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-[#181716] px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ImageSearch size={17} strokeWidth={1.8} />
      {pending ? "Buscando imágenes…" : "Buscar Imágenes"}
    </button>
  );
}

"use client";

import { useTransition } from "react";

import { deleteCategory } from "@/app/admin/category-actions";

type Props = {
  id: string;
  name: string;
  slug: string;
};

export default function DeleteCategoryButton({
  id,
  name,
  slug,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  function handleDelete() {
    const ok = confirm(
      `¿Seguro que quieres eliminar la categoría "${name}"?`
    );

    if (!ok) return;

    startTransition(async () => {
      try {
        await deleteCategory(id, slug);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al eliminar la categoría."
        );
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border px-4 py-2 transition hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "🗑"}
    </button>
  );
}
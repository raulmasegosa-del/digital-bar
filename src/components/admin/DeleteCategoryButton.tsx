"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/app/admin/category-actions";

type Props = {
  id: string;
  name: string;
};

export default function DeleteCategoryButton({
  id,
  name,
}: Props) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const ok = confirm(
      `¿Seguro que quieres eliminar la categoría "${name}"?`
    );

    if (!ok) return;

    startTransition(async () => {
  try {
    await deleteCategory(id);
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
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 text-white transition hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? "..." : "🗑"}
    </button>
  );
}
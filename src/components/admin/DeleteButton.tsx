"use client";

import { deleteProduct } from "@/app/admin/actions";
type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  async function handleDelete() {
    const ok = confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!ok) return;

    await deleteProduct(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      🗑️ Eliminar
    </button>
  );
}

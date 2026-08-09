import Link from "next/link";

import {
  createCategory,
  updateCategory,
} from "@/app/admin/category-actions";

type Category = {
  id?: string;
  name?: string;
};

type Props = {
  item?: Category;
  slug: string;
  restaurantId: string;
};

export default function CategoryForm({
  item,
  slug,
  restaurantId,
}: Props) {
  const category = item ?? {
    name: "",
  };

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold">
        {item
          ? "Editar categoría"
          : "Nueva categoría"}
      </h1>

      <form
        action={
          item
            ? updateCategory
            : createCategory
        }
        className="space-y-6"
      >
        <input
          type="hidden"
          name="slug"
          value={slug}
        />

        <input
          type="hidden"
          name="restaurant_id"
          value={restaurantId}
        />

        {item?.id && (
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>

          <input
            name="name"
            defaultValue={category.name}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
<Link
  href={`/admin/${slug}/categories`}
  className="rounded-lg border px-5 py-2"
>
  Cancelar
</Link>

          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700"
          >
            {item
              ? "Guardar cambios"
              : "Crear categoría"}
          </button>
        </div>
      </form>
    </div>
  );
}
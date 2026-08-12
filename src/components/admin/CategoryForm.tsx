import Link from "next/link";

import { createCategory, updateCategory } from "@/app/admin/category-actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Category = {
  id?: string;
  name?: string;
  image?: string | null;
};

type Props = {
  item?: Category;
  slug: string;
  restaurantId: string;
};

export default function CategoryForm({ item, slug, restaurantId }: Props) {
  const category = item ?? { name: "", image: null };

  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#11100f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500">Carta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {item ? "Editar categoría" : "Nueva categoría"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Configura el nombre y la imagen que verá el cliente antes de abrir la categoría.</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-8">
          <form action={item ? updateCategory : createCategory} className="space-y-7">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="restaurant_id" value={restaurantId} />
            {item?.id && <input type="hidden" name="id" value={item.id} />}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Nombre</label>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="h-12 w-full rounded-xl border border-zinc-700 bg-[#11100f] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/50"
              />
            </div>

            <section>
              <div className="mb-3">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Imagen de la categoría</label>
              </div>
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#11100f] p-4 sm:p-5">
                <ImageUpload image={category.image} />
              </div>
              <p className="mt-2 text-xs text-zinc-600">La misma imagen que uses aquí será la que verá el cliente antes de abrir los productos de esta categoría.</p>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
              <Link href={`/admin/${slug}/categories`} className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white">
                Cancelar
              </Link>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 px-6 text-sm font-semibold text-[#11100f] transition hover:bg-amber-400">
                {item ? "Guardar cambios" : "Crear categoría"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

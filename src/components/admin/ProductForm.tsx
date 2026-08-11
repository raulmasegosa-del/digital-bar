import Link from "next/link";
import {
  Camera,
  Check,
  Save,
  Plus,
} from "lucide-react";

import {
  createProduct,
  updateProduct,
} from "@/app/admin/actions";

import ImageUpload from "@/components/admin/ImageUpload";

type Category = {
  id: string;
  name: string;
};

type OptionGroup = {
  id: string;
  name: string;
};

type Product = {
  id?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  image?: string | null;
  available?: boolean;
  featured?: boolean;
  category_id?: string;
  price?: number;
};

type Props = {
  item?: Product;
  restaurantId?: string;
  slug?: string;
  categories: Category[];
  optionGroups?: OptionGroup[];
  selectedOptionGroups?: string[];
};

export default function ProductForm({
  item,
  restaurantId,
  slug,
  categories,
  optionGroups = [],
  selectedOptionGroups = [],
}: Props) {
  const product = item ?? {
    name: "",
    subtitle: "",
    description: "",
    image: null,
    available: true,
    featured: false,
    category_id: categories[0]?.id ?? "",
    price: 0,
  };

  const productsHref = slug
    ? `/admin/${slug}/products`
    : "/admin/products";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#181716] p-5 shadow-sm sm:p-7 lg:p-8">
      <form
        action={item ? updateProduct : createProduct}
        className="space-y-8"
      >
        {item?.id && (
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
        )}

        {restaurantId && (
          <input
            type="hidden"
            name="restaurant_id"
            value={restaurantId}
          />
        )}

        {slug && (
          <input
            type="hidden"
            name="slug"
            value={slug}
          />
        )}

        {/* Imagen */}
        <section>
          <div className="mb-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Imagen
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#11100f]">
            <ImageUpload image={product.image} />
          </div>

          <p className="mt-2 text-xs text-zinc-600">
            Recomendado: imagen horizontal de buena calidad.
          </p>
        </section>

        {/* Datos principales */}
        <section className="space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              Información del producto
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Datos básicos que aparecerán en la carta.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Nombre
              </label>

              <input
                id="name"
                name="name"
                defaultValue={product.name}
                required
                className="h-12 w-full rounded-xl border border-zinc-800 bg-[#11100f] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>

            {/* Precio */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Precio (€)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={String(product.price)}
                required
                className="h-12 w-full rounded-xl border border-zinc-800 bg-[#11100f] px-4 text-sm font-semibold text-white outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="category_id"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Categoría
            </label>

            <select
              id="category_id"
              name="category_id"
              defaultValue={product.category_id}
              className="h-12 w-full rounded-xl border border-zinc-800 bg-[#11100f] px-4 text-sm text-white outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="bg-[#181716]"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subtítulo */}
          <div>
            <label
              htmlFor="subtitle"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Subtítulo
            </label>

            <input
              id="subtitle"
              name="subtitle"
              defaultValue={product.subtitle}
              placeholder="Ej. Con queso, bacon y salsa..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-[#11100f] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Descripción
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description}
              placeholder="Describe el producto..."
              className="w-full resize-y rounded-xl border border-zinc-800 bg-[#11100f] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>
        </section>

        {/* Opciones */}
        <section>
          <div className="mb-3 flex flex-col gap-2 border-b border-zinc-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Grupos de opciones
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Configura extras, tamaños o ingredientes.
              </p>
            </div>

            <Link
              href={
                slug
                  ? `/admin/${slug}/options/new`
                  : "/admin/options/new"
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20"
            >
              <Plus size={14} />
              Nuevo grupo
            </Link>
          </div>

          <div className="space-y-2 rounded-xl border border-zinc-800 bg-[#11100f] p-3">
            {optionGroups.length === 0 ? (
              <p className="px-2 py-3 text-sm text-zinc-500">
                No hay grupos de opciones creados.
              </p>
            ) : (
              optionGroups.map((group) => {
                const checked =
                  selectedOptionGroups.includes(group.id);

                return (
                  <label
                    key={group.id}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 transition hover:bg-[#181716]"
                  >
                    <input
                      type="checkbox"
                      name="option_groups"
                      value={group.id}
                      defaultChecked={checked}
                      className="h-5 w-5 accent-amber-500"
                    />

                    <span className="text-sm text-zinc-300">
                      {group.name}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </section>

        {/* Estado */}
        <section>
          <div className="mb-3 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              Estado
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Controla cómo se muestra el producto en la carta.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Disponible */}
            <label className="flex min-h-16 cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-[#11100f] px-4 transition hover:border-zinc-700">
              <div>
                <p className="text-sm font-medium text-white">
                  Disponible
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Visible para los clientes
                </p>
              </div>

              <div className="relative">
                <input
                  type="checkbox"
                  name="available"
                  defaultChecked={product.available}
                  className="peer sr-only"
                />

                <div className="h-7 w-12 rounded-full bg-zinc-700 transition peer-checked:bg-emerald-500" />

                <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </div>
            </label>

            {/* Destacado */}
            <label className="flex min-h-16 cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-[#11100f] px-4 transition hover:border-zinc-700">
              <div>
                <p className="text-sm font-medium text-white">
                  Destacado
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Marcar como producto destacado
                </p>
              </div>

              <div className="relative">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={product.featured}
                  className="peer sr-only"
                />

                <div className="h-7 w-12 rounded-full bg-zinc-700 transition peer-checked:bg-amber-500" />

                <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </section>

        {/* Acciones */}
        <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">
          <Link
            href={productsHref}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500 px-7 text-sm font-semibold text-[#11100f] transition hover:bg-amber-400 active:scale-[0.98]"
          >
            {item ? (
              <>
                <Save size={17} />
                Guardar cambios
              </>
            ) : (
              <>
                <Check size={17} />
                Crear producto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
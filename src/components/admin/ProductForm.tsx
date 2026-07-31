import Link from "next/link";
import { createProduct, updateProduct } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Category = {
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
  categories: Category[];
};

export default function ProductForm({
  item,
  categories,
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

  return (
    <div className="rounded-2xl border bg-white p-8 shadow">
      <h2 className="mb-8 text-3xl font-bold">
        {item ? "Editar producto" : "Nuevo producto"}
      </h2>

      <form
        action={item ? updateProduct : createProduct}
        className="space-y-6"
      >
        {item?.id && (
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
        )}

        <ImageUpload image={product.image} />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Categoría
          </label>

          <select
            name="category_id"
            defaultValue={product.category_id}
            className="w-full rounded-lg border p-3"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Nombre
          </label>

          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Precio (€)
          </label>

          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={product.price}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Subtítulo
          </label>

          <input
            type="text"
            name="subtitle"
            defaultValue={product.subtitle}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Descripción
          </label>

          <textarea
            name="description"
            rows={4}
            defaultValue={product.description}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              defaultChecked={product.available}
            />
            Disponible
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product.featured}
            />
            Destacado
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href="/admin"
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-6 py-2 font-medium text-white transition hover:bg-amber-700"
          >
            {item ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
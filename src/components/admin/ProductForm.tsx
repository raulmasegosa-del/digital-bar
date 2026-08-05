import Link from "next/link";

import { createProduct, updateProduct } from "@/app/admin/actions";

import ImageUpload from "@/components/admin/ImageUpload";

import TextInput from "@/components/ui/form/TextInput";
import TextareaField from "@/components/ui/form/TextareaField";
import SelectField from "@/components/ui/form/SelectField";
import Switch from "@/components/ui/form/Switch";
import PrimaryButton from "@/components/ui/form/PrimaryButton";

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
  categories: Category[];
  optionGroups?: OptionGroup[];
  selectedOptionGroups?: string[];
};

export default function ProductForm({
  item,
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

        <SelectField
          name="category_id"
          label="Categoría"
          defaultValue={product.category_id}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />

        <TextInput
          label="Nombre"
          name="name"
          defaultValue={product.name}
          required
        />

        <TextInput
          label="Precio (€)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={String(product.price)}
          required
        />

        <TextInput
          label="Subtítulo"
          name="subtitle"
          defaultValue={product.subtitle}
        />

        <TextareaField
          label="Descripción"
          name="description"
          rows={4}
          defaultValue={product.description}
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold">
              Grupos de opciones
            </label>

            <Link
              href="/admin/options/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-amber-600 transition hover:text-amber-700 hover:underline"
            >
              + Nuevo grupo
            </Link>
          </div>

          <div className="space-y-2 rounded-xl border border-gray-200 p-4">
            {optionGroups.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay grupos de opciones creados.
              </p>
            ) : (
              optionGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    name="option_groups"
                    value={group.id}
                    defaultChecked={selectedOptionGroups.includes(group.id)}
                  />

                  <span>{group.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Switch
            name="available"
            label="Disponible"
            defaultChecked={product.available}
          />

          <Switch
            name="featured"
            label="Destacado"
            defaultChecked={product.featured}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link href="/admin/products">
            <button
              type="button"
              className="rounded-xl border px-5 py-2 transition hover:bg-gray-50"
            >
              Cancelar
            </button>
          </Link>

          <PrimaryButton type="submit">
            {item
              ? "💾 Guardar cambios"
              : "➕ Crear producto"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
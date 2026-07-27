import { MenuItem } from "@/types/menu";

type Props = {
  item: MenuItem;
};

export default function ProductForm({ item }: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Editar producto
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre
          </label>

          <input
            defaultValue={item.name}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Subtítulo
          </label>

          <input
            defaultValue={item.subtitle}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Descripción
          </label>

          <textarea
            defaultValue={item.description}
            rows={4}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked={item.available}
          />

          Disponible
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked={item.featured}
          />

          Destacado
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button className="rounded-lg border px-5 py-2">
            Cancelar
          </button>

          <button className="rounded-lg bg-amber-600 px-5 py-2 text-white hover:bg-amber-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
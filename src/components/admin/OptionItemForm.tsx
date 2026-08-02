import Link from "next/link";
import {
  createOptionItem,
  updateOptionItem,
} from "@/app/admin/actions";

type Group = {
  id: string;
  name: string;
};

type OptionItem = {
  id?: string;
  group_id?: string;
  name?: string;
  extra_price?: number;
  order?: number;
  available?: boolean;
};

type Props = {
  item?: OptionItem;
  groups: Group[];
};

export default function OptionItemForm({
  item,
  groups,
}: Props) {
  const option = item ?? {
    group_id: groups[0]?.id ?? "",
    name: "",
    extra_price: 0,
    order: 0,
    available: true,
  };

  return (
    <div className="rounded-2xl border bg-white p-8 shadow">
      <h2 className="mb-8 text-3xl font-bold">
        {item ? "Editar opción" : "Nueva opción"}
      </h2>

      <form
        action={item ? updateOptionItem : createOptionItem}
        className="space-y-6"
      >
        {item?.id && (
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Grupo
          </label>

          <select
            name="group_id"
            defaultValue={option.group_id}
            className="w-full rounded-lg border p-3"
            required
          >
            {groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
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
            defaultValue={option.name}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Precio extra (€)
          </label>

          <input
            type="number"
            name="extra_price"
            step="0.01"
            min="0"
            defaultValue={option.extra_price}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Orden
          </label>

          <input
            type="number"
            name="order"
            defaultValue={option.order}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            defaultChecked={option.available}
          />
          Disponible
        </label>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href="/admin/options"
            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-6 py-2 font-medium text-white transition hover:bg-amber-700"
          >
            {item ? "Guardar cambios" : "Crear opción"}
          </button>
        </div>
      </form>
    </div>
  );
}
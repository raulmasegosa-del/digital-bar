import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import MenuExcelUploader from "@/components/super/MenuExcelUploader";

import { getRestaurant } from "@/lib/db/restaurants/getRestaurant";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const columns = [
  {
    name: "categoria",
    type: "Texto",
    required: true,
  },
  {
    name: "nombre",
    type: "Texto",
    required: true,
  },
  {
    name: "precio",
    type: "Número",
    required: true,
  },
  {
    name: "subtitulo",
    type: "Texto",
    required: false,
  },
  {
    name: "descripcion",
    type: "Texto",
    required: false,
  },
  {
    name: "disponible",
    type: "Sí / No",
    required: false,
  },
  {
    name: "destacado",
    type: "Sí / No",
    required: false,
  },
  {
    name: "tiempo_preparacion",
    type: "Número entero",
    required: false,
  },
];

export default async function ImportMenuPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main>
      <PageHeader
        title="Importar carta"
        description={`Importación de Excel · ${restaurant.name}`}
        backHref={`/super/restaurants/${slug}`}
        backLabel="Restaurante"
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Formato del Excel
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Prepara el Excel utilizando exactamente estas
            columnas y en este orden.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Orden
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Columna
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Tipo
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Obligatorio
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {columns.map((column, index) => (
                  <tr key={column.name}>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-mono text-sm">
                      {column.name}

                      {column.required && (
                        <span className="ml-1 font-bold text-red-600">
                          *
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {column.type}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {column.required ? (
                        <span className="font-semibold text-red-600">
                          Sí
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            <span className="font-bold text-red-600">
              *
            </span>{" "}
            Campo obligatorio.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Seleccionar Excel
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Selecciona el archivo para validarlo y revisar
            una vista previa antes de importarlo.
          </p>

          <MenuExcelUploader
            slug={slug}
            restaurantId={restaurant.id}
          />
        </section>
      </div>
    </main>
  );
}
import { getCategories } from "@/lib/db/categories";

export default async function Menu() {
  const categories = await getCategories();

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-700">
        Nuestra carta
      </h2>

      {categories.map((category: any) => (
        <article
          key={category.id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <h3 className="text-xl font-semibold">
            {category.name}
          </h3>

          <p className="text-gray-500">
            Próximamente aparecerán aquí los productos.
          </p>
        </article>
      ))}
    </section>
  );
}
import PageHeader from "@/components/ui/PageHeader";

export default function CocinaPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Cocina"
        description="La cocina se gestiona por restaurante."
        backHref="/super/restaurants"
        backLabel="Restaurantes"
      />

      <section className="rounded-2xl border border-zinc-800 bg-[#181716] p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Selecciona un restaurante
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Abre la cocina desde la ficha del restaurante para ver únicamente sus
          pedidos.
        </p>
      </section>
    </main>
  );
}

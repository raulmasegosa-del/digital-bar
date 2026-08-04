import MetricCard from "./MetricCard";

type Props = {
  averagePreparationTime: number;
  activeTables: number;
};

export default function KitchenMetrics({
  averagePreparationTime,
  activeTables,
}: Props) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <MetricCard
        title="Tiempo medio"
        value={`${averagePreparationTime} min`}
        subtitle="Preparación"
      />

      <MetricCard
        title="Mesas activas"
        value={activeTables}
        subtitle="Ahora mismo"
        color="text-green-600"
      />
    </section>
  );
}
export default function DashboardHeader() {
  const now = new Date();

  return (
    <header className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow">
      <h1 className="text-4xl font-bold">
        📊 Centro de Mando
      </h1>

      <p className="text-gray-500">
        {now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </header>
  );
}
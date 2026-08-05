export default function DashboardHeader() {
  const now = new Date();

  return (
    <header className="rounded-3xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Restaurante */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-2xl">
            🍺
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none text-gray-900">
              DIGITAL BAR
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Restaurante de demostración
            </p>
          </div>
        </div>

        {/* Estado */}
        <div className="flex flex-col items-start text-xs text-gray-500 md:items-end">
          <span>
            {now.toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <span className="mt-1 flex items-center gap-1 font-medium text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Operativo
          </span>
        </div>
      </div>
    </header>
  );
}
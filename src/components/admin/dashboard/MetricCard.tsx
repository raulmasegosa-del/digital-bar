type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
};

const icons: Record<string, string> = {
  "Tiempo medio": "⏱️",
  "Mesas activas": "🍽️",
};

export default function MetricCard({
  title,
  value,
  subtitle,
  color = "text-amber-600",
}: Props) {
  return (
    <article
      className="
        group
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p
            className={`mt-3 text-5xl font-bold tracking-tight ${color}`}
          >
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-amber-50
            text-3xl
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          {icons[title] ?? "📊"}
        </div>
      </div>
    </article>
  );
}
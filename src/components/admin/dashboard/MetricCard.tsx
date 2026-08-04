type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
};

export default function MetricCard({
  title,
  value,
  subtitle,
  color = "text-amber-600",
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-5xl font-bold ${color}`}
      >
        {value}
      </p>

      {subtitle && (
        <p className="mt-2 text-sm text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
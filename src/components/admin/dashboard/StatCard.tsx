import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-white",
}: Props) {
  return (
    <article
      className={`
        ${color}
        group
        rounded-3xl
        border
        border-gray-100
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-amber-50
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          <Icon className="h-7 w-7 text-amber-600" />
        </div>
      </div>
    </article>
  );
}
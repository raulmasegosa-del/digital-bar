type Props = {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-white",
}: Props) {
  return (
    <article
      className={`
        ${color}
        rounded-2xl
        p-6
        shadow-md
        transition
        hover:shadow-xl
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-4xl font-bold">
            {value}
          </p>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </article>
  );
}
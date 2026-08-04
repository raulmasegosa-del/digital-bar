type Props = {
  title: string;
  value: string | number;
  icon: string;
};

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-4xl">
          {icon}
        </span>

        <span
          className="
            text-3xl
            font-bold
            text-amber-600
          "
        >
          {value}
        </span>
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-semibold
          text-gray-700
        "
      >
        {title}
      </h3>
    </div>
  );
}
type Props = {
  title: string;
  description: string;
  status: string;
};

const styles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "🟢",
    text: "text-green-700",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "🟡",
    text: "text-yellow-700",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "🔴",
    text: "text-red-700",
  },
};

export default function RestaurantStatus({
  title,
  description,
  status,
}: Props) {
  const style =
    styles[
      status as
        | "success"
        | "warning"
        | "danger"
    ];

  return (
    <section
      className={`
        ${style.bg}
        ${style.border}
        rounded-2xl
        border
        p-6
        shadow-sm
      `}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
          {style.icon}
        </div>

        <div className="flex-1">
          <h2
            className={`text-2xl font-bold ${style.text}`}
          >
            {title}
          </h2>

          <p className="mt-1 text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
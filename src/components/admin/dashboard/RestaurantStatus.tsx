type Props = {
  title: string;
  description: string;
  status: string;
};

export default function RestaurantStatus({
  title,
  description,
  status,
}: Props) {
  const color = {
    success:
      "border-green-500 bg-green-50",
    warning:
      "border-yellow-500 bg-yellow-50",
    danger:
      "border-red-500 bg-red-50",
  }[
    status as
      | "success"
      | "warning"
      | "danger"
  ];

  return (
    <section
      className={`rounded-2xl border-2 ${color} p-6 shadow`}
    >
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </section>
  );
}
type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  switch (status) {
    case "pending":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-700">
          🟡 Nuevo
        </span>
      );

    case "preparing":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
          🔵 Preparando
        </span>
      );

    case "served":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
          🟢 Listo
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
          {status}
        </span>
      );
  }
}
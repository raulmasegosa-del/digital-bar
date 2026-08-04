type Props = {
  children: React.ReactNode;
  color?:
    | "green"
    | "red"
    | "yellow"
    | "blue";
};

export default function Badge({
  children,
  color = "green",
}: Props) {
  const colors = {
    green:
      "bg-green-100 text-green-700",
    red:
      "bg-red-100 text-red-700",
    yellow:
      "bg-yellow-100 text-yellow-700",
    blue:
      "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm ${colors[color]}`}
    >
      {children}
    </span>
  );
}
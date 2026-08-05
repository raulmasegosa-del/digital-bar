type Props = {
  children: React.ReactNode;

  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";

  size?: "sm" | "md";
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
}: Props) {
  const variants = {
    default:
      "bg-amber-100 text-amber-800",

    success:
      "bg-green-100 text-green-700",

    warning:
      "bg-yellow-100 text-yellow-800",

    danger:
      "bg-red-100 text-red-700",

    info:
      "bg-blue-100 text-blue-700",

    neutral:
      "bg-gray-100 text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",

    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        font-medium
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}
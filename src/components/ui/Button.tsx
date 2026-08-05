import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "ghost";

  size?: "sm" | "md" | "lg";

  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-700",

    secondary:
      "border border-gray-200 bg-white hover:bg-gray-50",

    success:
      "bg-emerald-600 text-white hover:bg-emerald-700",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-4 py-2",

    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    />
  );
}
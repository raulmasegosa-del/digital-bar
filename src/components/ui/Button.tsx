import {
  ButtonHTMLAttributes,
} from "react";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "primary"
      | "secondary"
      | "danger";
  };

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-700",

    secondary:
      "border bg-white hover:bg-gray-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-4
        py-2
        font-semibold
        transition
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    />
  );
}
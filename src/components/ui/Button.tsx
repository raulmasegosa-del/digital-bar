import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-700",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-5
        py-2.5
        font-medium
        shadow-sm
        transition
        duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

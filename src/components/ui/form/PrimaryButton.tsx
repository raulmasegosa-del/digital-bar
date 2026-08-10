import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-amber-600
        px-5
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-amber-700
        hover:shadow-md
        active:translate-y-0
        active:shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-amber-500
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:translate-y-0
        disabled:hover:shadow-sm
        ${className}
      `}
    >
      {children}
    </button>
  );
}
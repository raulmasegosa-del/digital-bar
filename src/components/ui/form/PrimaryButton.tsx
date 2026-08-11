import type {
  ButtonHTMLAttributes,
} from "react";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement>;

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
        min-h-12
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-amber-500/40
        bg-amber-500
        px-6
        py-3
        text-sm
        font-semibold
        text-[#11100f]
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-amber-400
        hover:shadow-md
        active:translate-y-0
        active:scale-[0.98]
        active:shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-amber-500/40
        focus:ring-offset-2
        focus:ring-offset-[#11100f]
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
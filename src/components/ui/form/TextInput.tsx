import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: ReactNode;
};

export default function TextInput({
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  leftIcon,
  ...props
}: Props) {
  return (
    <div
      className={`space-y-2 ${containerClassName}`}
    >
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-600">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`
            min-h-12
            w-full
            rounded-xl
            border
            bg-[#151413]
            px-4
            py-3
            text-sm
            text-white
            outline-none
            transition
            placeholder:text-zinc-600
            ${
              leftIcon
                ? "pl-11"
                : ""
            }
            ${
              error
                ? `
                  border-red-500/60
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-500/10
                `
                : `
                  border-zinc-800
                  hover:border-zinc-700
                  focus:border-amber-500/50
                  focus:bg-[#181716]
                  focus:ring-2
                  focus:ring-amber-500/10
                `
            }
            ${className}
          `}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-zinc-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
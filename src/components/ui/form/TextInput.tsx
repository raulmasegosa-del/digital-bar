import type { InputHTMLAttributes, ReactNode } from "react";

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
    <div className={`space-y-2 ${containerClassName}`}>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-gray-900
            outline-none
            transition
            ${
              leftIcon ? "pl-10" : ""
            }
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            }
            ${className}
          `}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-500">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
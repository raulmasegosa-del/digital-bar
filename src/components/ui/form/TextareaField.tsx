import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export default function TextareaField({
  label,
  helperText,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <textarea
        {...props}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-gray-900
          transition
          outline-none
          resize-none
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          }
          ${className}
        `}
      />

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
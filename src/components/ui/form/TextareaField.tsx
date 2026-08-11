import type {
  TextareaHTMLAttributes,
} from "react";

type Props =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <textarea
        {...props}
        className={`
          min-h-32
          w-full
          resize-none
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
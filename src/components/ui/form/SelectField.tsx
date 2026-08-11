type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  defaultValue?: string;
  helperText?: string;
};

export default function SelectField({
  name,
  label,
  options,
  defaultValue,
  helperText,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="
          min-h-12
          w-full
          cursor-pointer
          rounded-xl
          border
          border-zinc-800
          bg-[#151413]
          px-4
          py-3
          text-sm
          text-white
          outline-none
          transition
          hover:border-zinc-700
          focus:border-amber-500/50
          focus:bg-[#181716]
          focus:ring-2
          focus:ring-amber-500/10
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#181716] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && (
        <p className="text-sm text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
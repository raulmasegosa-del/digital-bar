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
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          text-gray-900
          outline-none
          transition
          focus:border-amber-500
          focus:ring-2
          focus:ring-amber-100
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
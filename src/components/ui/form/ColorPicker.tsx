type Props = {
  name: string;
  label: string;
  defaultValue: string;
  helperText?: string;
};

export default function ColorPicker({
  name,
  label,
  defaultValue,
  helperText,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-4">
        <input
          type="color"
          name={name}
          defaultValue={defaultValue}
          className="h-14 w-20 cursor-pointer rounded-xl border border-gray-200"
        />

        <div>
          <p className="font-medium text-gray-700">
            {defaultValue}
          </p>

          {helperText && (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
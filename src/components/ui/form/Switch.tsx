type Props = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  description?: string;
};

export default function Switch({
  name,
  label,
  defaultChecked = false,
  description,
}: Props) {
  return (
    <label className="flex items-start justify-between gap-6 rounded-2xl border border-gray-200 p-5 transition hover:border-amber-300">
      <div>
        <p className="font-semibold text-gray-900">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="
          mt-1
          h-5
          w-5
          accent-amber-600
        "
      />
    </label>
  );
}
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
    <label
      className="
        flex
        min-h-[76px]
        cursor-pointer
        items-center
        justify-between
        gap-6
        rounded-2xl
        border
        border-zinc-800
        bg-[#151413]
        px-5
        py-4
        transition
        hover:border-zinc-700
        hover:bg-[#181716]
      "
    >
      <div>
        <p className="font-medium text-zinc-200">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        )}
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="
            peer
            sr-only
          "
        />

        <div
          className="
            h-8
            w-14
            rounded-full
            border
            border-zinc-700
            bg-zinc-800
            transition
            peer-checked:border-emerald-500
            peer-checked:bg-emerald-500
            peer-focus-visible:ring-2
            peer-focus-visible:ring-amber-500/40
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1
            top-1
            h-6
            w-6
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            peer-checked:translate-x-6
          "
        />
      </div>
    </label>
  );
}
type Props = {
  title: string;
};

export default function EmptyState({
  title,
}: Props) {
  return (
    <div className="rounded-2xl border border-dashed p-10 text-center text-gray-400">
      {title}
    </div>
  );
}
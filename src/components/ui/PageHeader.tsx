import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
};

export default function PageHeader({
  title,
  description,
  buttonText,
  buttonHref,
}: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {buttonHref && buttonText && (
        <Link
          href={buttonHref}
          className="rounded-xl bg-amber-600 px-5 py-3 font-medium text-white transition hover:bg-amber-700"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
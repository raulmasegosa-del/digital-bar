import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-gray-600">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
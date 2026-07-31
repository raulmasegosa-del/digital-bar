import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white
        p-6
        shadow
        border
        border-gray-100
        ${className}
      `}
    >
      {children}
    </div>
  );
}
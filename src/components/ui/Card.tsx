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
    <section
      className={`
        rounded-2xl
        bg-white
        p-6
        shadow
        ${className}
      `}
    >
      {children}
    </section>
  );
}
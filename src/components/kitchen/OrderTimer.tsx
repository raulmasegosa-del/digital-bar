"use client";

import { useEffect, useState } from "react";

type Props = {
  createdAt: string;
};

export default function OrderTimer({
  createdAt,
}: Props) {
  const getMinutes = () =>
    Math.floor(
      (Date.now() -
        new Date(createdAt).getTime()) /
        60000
    );

  const [minutes, setMinutes] =
    useState(getMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getMinutes());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  let color = "text-green-600";

  if (minutes >= 5) {
    color = "text-yellow-600";
  }

  if (minutes >= 10) {
    color = "text-red-600";
  }

  return (
    <div
      className={`
        flex
        items-center
        gap-2
        text-lg
        font-bold
        ${color}
      `}
    >
      🕒 {minutes} min
    </div>
  );
}
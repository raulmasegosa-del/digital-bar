"use client";

import { useEffect, useState } from "react";

type Props = {
  createdAt: string;
};

export default function OrderTimer({
  createdAt,
}: Props) {
  const [minutes, setMinutes] =
    useState<number | null>(null);

  useEffect(() => {
    function update() {
      setMinutes(
        Math.floor(
          (Date.now() -
            new Date(createdAt).getTime()) /
            60000
        )
      );
    }

    update();

    const interval = setInterval(
      update,
      1000
    );

    return () =>
      clearInterval(interval);
  }, [createdAt]);

  if (minutes === null) {
    return (
      <div className="text-lg font-bold text-gray-400">
        🕒 ...
      </div>
    );
  }

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
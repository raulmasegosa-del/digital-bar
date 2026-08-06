"use client";

import { useEffect, useState } from "react";

type Props = {
  from: string;
};

export default function ElapsedTime({
  from,
}: Props) {
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    function update() {
      setMinutes(
        Math.floor(
          (Date.now() -
            new Date(from).getTime()) /
            60000
        )
      );
    }

    update();

    const interval = setInterval(
      update,
      1000
    );

    return () => clearInterval(interval);
  }, [from]);

  let color =
    "text-emerald-600";

  if (minutes >= 5) {
    color = "text-amber-600";
  }

  if (minutes >= 10) {
    color = "text-red-600";
  }

  return (
    <span
      className={`font-bold ${color}`}
    >
      🕒 {minutes} min
    </span>
  );
}
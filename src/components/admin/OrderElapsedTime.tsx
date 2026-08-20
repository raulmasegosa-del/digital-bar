"use client";

import { useEffect, useState } from "react";

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function OrderElapsedTime({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(() => Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)));

  useEffect(() => {
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [createdAt]);

  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-300" title={`Desde ${new Date(createdAt).toLocaleString("es-ES")}`}>
      ⏱ {formatElapsed(elapsed)}
    </span>
  );
}

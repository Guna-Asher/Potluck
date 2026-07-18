"use client";

import { useEffect, useState } from "react";

interface LiveIndicatorProps {
  /** react-query's dataUpdatedAt (ms epoch); 0/undefined until a read lands. */
  updatedAt?: number;
}

/** "● Live · updated Ns ago" — makes the existing 4s polling visible instead
 * of silent. Only re-renders itself once a second; the actual data refresh
 * cadence lives in usePot, untouched. */
export function LiveIndicator({ updatedAt }: LiveIndicatorProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 1_000);
    return () => clearInterval(id);
  }, []);

  if (!updatedAt) return null;

  const seconds = Math.max(0, Math.round((Date.now() - updatedAt) / 1000));
  const agoLabel = seconds < 60 ? `updated ${seconds}s ago` : "updated over a minute ago";

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs tabular-nums text-neutral-400">
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live · {agoLabel}
    </span>
  );
}

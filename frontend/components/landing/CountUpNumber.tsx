"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpNumberProps {
  value: number;
  className?: string;
}

/** Counts up to `value` once, when scrolled into view. Used for the one
 * genuinely numeric credibility badge (test count) — not applied anywhere
 * else, since a status claim like "Contract Verified" has no number to count. */
export function CountUpNumber({ value, className }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const durationMs = 900;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

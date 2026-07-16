"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** A lightweight per-navigation fade, not a full route-crossfade — the
 * outgoing page just disappears (imperceptible, since focus is on what's
 * arriving) while the incoming one fades and rises slightly on mount.
 * Keyed on pathname so React remounts (and re-triggers the animation on)
 * every navigation, including between two /pot/[potId] routes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

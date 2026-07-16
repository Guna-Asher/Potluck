import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** The one card shell used everywhere — forms, progress, dashboard tiles —
 * so spacing/radius/shadow stay consistent instead of redrawn per component. */
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

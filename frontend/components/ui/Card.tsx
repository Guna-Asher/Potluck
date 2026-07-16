import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds a hover-lift + deeper shadow for cards that are themselves a link
   * or button (e.g. PotCard) — purely a CSS transition, not JS-driven,
   * since a hover affordance this small doesn't need Framer Motion's cost. */
  interactive?: boolean;
}

/** The one card shell used everywhere — forms, progress, dashboard tiles —
 * so spacing/radius/shadow stay consistent instead of redrawn per component. */
export function Card({ children, className = "", interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card sm:p-7 ${
        interactive ? "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

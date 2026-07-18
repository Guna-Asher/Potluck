import type { FormEvent, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds a hover-lift + deeper shadow for cards that are themselves a link
   * or button (e.g. PotCard) — purely a CSS transition, not JS-driven,
   * since a hover affordance this small doesn't need Framer Motion's cost. */
  interactive?: boolean;
  /** Forms need the card shell to BE the <form> element, not wrap one —
   * this keeps them on the shared shell instead of re-typing its classes. */
  as?: "div" | "form";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

/** The one card shell used everywhere — forms, progress, dashboard tiles —
 * so spacing/radius/shadow stay consistent instead of redrawn per component. */
export function Card({ children, className = "", interactive = false, as = "div", onSubmit }: CardProps) {
  const shellClassName = `rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card sm:p-7 ${
    interactive ? "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover" : ""
  } ${className}`;

  if (as === "form") {
    return (
      <form onSubmit={onSubmit} className={shellClassName}>
        {children}
      </form>
    );
  }

  return <div className={shellClassName}>{children}</div>;
}

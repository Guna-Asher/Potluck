import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/** The one page-title block used by every app page (not the marketing
 * landing page, which has its own hero treatment) — keeps heading size,
 * weight, tracking, and subtitle color consistent across the app instead
 * of each page re-deriving its own "close enough" heading styles. */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="max-w-lg text-neutral-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

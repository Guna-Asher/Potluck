import type { Pot } from "@/hooks/usePot";
import { getPotStatus, type PotStatus } from "@/lib/potStatus";

const STATUS_CONFIG: Record<PotStatus, { label: string; badgeClassName: string; dotClassName: string }> = {
  active: {
    label: "Funding Open",
    badgeClassName: "bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500",
  },
  goalReached: {
    label: "Goal Reached",
    badgeClassName: "bg-emerald-50 text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
  released: {
    label: "Released",
    badgeClassName: "bg-neutral-100 text-neutral-600",
    dotClassName: "bg-neutral-400",
  },
  refundable: {
    label: "Refund Available",
    badgeClassName: "bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500",
  },
};

export function PotStatusBadge({ pot }: { pot: Pot }) {
  const config = STATUS_CONFIG[getPotStatus(pot)];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.badgeClassName}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`} aria-hidden />
      {config.label}
    </span>
  );
}

import type { Pot } from "@/hooks/usePot";
import { getPotStatus, type PotStatus } from "@/lib/potStatus";

const STATUS_CONFIG: Record<PotStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-blue-50 text-blue-700" },
  goalReached: { label: "Goal reached", className: "bg-emerald-50 text-emerald-700" },
  released: { label: "Released", className: "bg-neutral-100 text-neutral-600" },
  refundable: { label: "Refunds open", className: "bg-amber-50 text-amber-700" },
};

export function PotStatusBadge({ pot }: { pot: Pot }) {
  const config = STATUS_CONFIG[getPotStatus(pot)];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

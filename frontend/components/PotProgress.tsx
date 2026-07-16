import type { Pot } from "@/hooks/usePot";
import { calculateProgress, formatCountdown, formatMon } from "@/lib/format";
import { Card } from "./ui/Card";
import { PotStatusBadge } from "./PotStatusBadge";

interface PotProgressProps {
  pot: Pot;
}

export function PotProgress({ pot }: PotProgressProps) {
  const percentage = calculateProgress(pot.totalContributed, pot.targetAmount);
  const nearGoal = percentage >= 75 && percentage < 100;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-3xl font-semibold tracking-tight text-neutral-900">
            {formatMon(pot.totalContributed)}
          </span>
          <span className="ml-1.5 text-neutral-400">of {formatMon(pot.targetAmount)} goal</span>
        </div>
        <PotStatusBadge pot={pot} />
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            percentage >= 100 ? "bg-emerald-500" : nearGoal ? "bg-emerald-400" : "bg-blue-400"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          {pot.contributorCount.toString()} {pot.contributorCount === 1n ? "person" : "people"} chipped in
        </span>
        <span>{formatCountdown(pot.deadline)}</span>
      </div>
    </Card>
  );
}

import { calculateProgress, formatCountdown, formatMon } from "@/lib/format";

interface PotProgressProps {
  totalContributed: bigint;
  targetAmount: bigint;
  deadline: bigint;
  contributorCount: bigint;
  released: boolean;
}

export function PotProgress({
  totalContributed,
  targetAmount,
  deadline,
  contributorCount,
  released,
}: PotProgressProps) {
  const percentage = calculateProgress(totalContributed, targetAmount);

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-neutral-900">{formatMon(totalContributed)}</span>
        <span className="text-neutral-400">of {formatMon(targetAmount)} goal</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percentage}%` }} />
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          {contributorCount.toString()} {contributorCount === 1n ? "person" : "people"} chipped in
        </span>
        <span>{released ? "Released" : formatCountdown(deadline)}</span>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
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
  const goalMet = percentage >= 100;
  const remaining = pot.targetAmount > pot.totalContributed ? pot.targetAmount - pot.totalContributed : 0n;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-4xl font-semibold tabular-nums tracking-tight text-neutral-900">
            {formatMon(pot.totalContributed)}
          </p>
          <p className="mt-1 text-sm tabular-nums text-neutral-500">raised of {formatMon(pot.targetAmount)} goal</p>
        </div>
        <PotStatusBadge pot={pot} />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)]">
          <motion.div
            className={`h-full rounded-full ${
              goalMet
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : nearGoal
                  ? "bg-gradient-to-r from-emerald-300 to-emerald-400"
                  : "bg-gradient-to-r from-blue-300 to-blue-400"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between text-sm tabular-nums">
          <span className="font-medium text-neutral-700">{percentage.toFixed(0)}% funded</span>
          <span className="text-neutral-500">
            {goalMet ? "Goal reached" : `${formatMon(remaining)} to go`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-sm tabular-nums text-neutral-500">
        <span>
          {pot.contributorCount.toString()} {pot.contributorCount === 1n ? "person" : "people"} chipped in
        </span>
        <span>{pot.released ? "Released" : formatCountdown(pot.deadline)}</span>
      </div>
    </Card>
  );
}

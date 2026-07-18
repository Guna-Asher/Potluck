"use client";

import Link from "next/link";
import { usePot } from "@/hooks/usePot";
import { calculateProgress, formatCountdown, formatMon } from "@/lib/format";
import type { PotRole } from "@/lib/potHistory";
import { Card } from "./ui/Card";
import { PotStatusBadge } from "./PotStatusBadge";

interface PotCardProps {
  potId: bigint;
  role: PotRole;
  fallbackTitle: string;
}

export function PotCard({ potId, role, fallbackTitle }: PotCardProps) {
  const { pot, isLoading } = usePot(potId);
  const percentage = pot ? calculateProgress(pot.totalContributed, pot.targetAmount) : 0;
  const goalMet = percentage >= 100;

  return (
    <Link href={`/pot/${potId.toString()}`} className="block">
      <Card interactive className="h-full space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold text-neutral-900">{pot?.title ?? fallbackTitle}</h3>
          {pot && <PotStatusBadge pot={pot} />}
        </div>

        {pot ? (
          <>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full ${goalMet ? "bg-emerald-500" : "bg-blue-400"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm tabular-nums">
              <span className="font-medium text-neutral-700">{formatMon(pot.totalContributed)}</span>
              <span className="text-neutral-400">of {formatMon(pot.targetAmount)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-neutral-400">{isLoading ? "Loading…" : "Unavailable right now"}</p>
        )}

        <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-400">
          <span>{role === "organizer" ? "You organized this" : "You contributed"}</span>
          {pot && (
            <span className="tabular-nums">
              {pot.released ? "Released" : formatCountdown(pot.deadline)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

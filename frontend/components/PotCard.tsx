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
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm tabular-nums">
              <span className="font-medium text-neutral-700">{formatMon(pot.totalContributed)}</span>
              <span className="text-neutral-400">of {formatMon(pot.targetAmount)}</span>
            </div>
          </>
        ) : isLoading ? (
          <div className="animate-pulse space-y-3" aria-hidden>
            <div className="h-2 w-full rounded-full bg-neutral-100" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded-md bg-neutral-200/70" />
              <div className="h-4 w-16 rounded-md bg-neutral-200/70" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Unavailable right now</p>
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

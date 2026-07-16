"use client";

import Link from "next/link";
import { usePot } from "@/hooks/usePot";
import { calculateProgress, formatMon } from "@/lib/format";
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
    <Link href={`/pot/${potId.toString()}`} className="block transition-transform hover:-translate-y-0.5">
      <Card className="h-full space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold text-neutral-900">{pot?.title ?? fallbackTitle}</h3>
          {pot && <PotStatusBadge pot={pot} />}
        </div>

        {pot ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-neutral-500">
              {formatMon(pot.totalContributed)} of {formatMon(pot.targetAmount)}
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-400">{isLoading ? "Loading…" : "Unavailable right now"}</p>
        )}

        <span className="inline-flex items-center text-xs font-medium text-neutral-400">
          {role === "organizer" ? "You organized this" : "You contributed"}
        </span>
      </Card>
    </Link>
  );
}

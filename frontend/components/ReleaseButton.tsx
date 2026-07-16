"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { useRelease } from "@/hooks/useRelease";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { getPotStatus } from "@/lib/potStatus";
import { Card } from "./ui/Card";
import { TransactionStatus } from "./TransactionStatus";

interface ReleaseButtonProps {
  potId: bigint;
}

/** Self-gating, mirroring release()'s own require conditions exactly via
 * getPotStatus: renders nothing unless the connected wallet is the organizer
 * and the pot's status is "goalReached" (which already implies not released
 * and still before the deadline). */
export function ReleaseButton({ potId }: ReleaseButtonProps) {
  const { address } = useAccount();
  const { pot, refetch } = usePot(potId);
  const { release, hash, isPending, isConfirming, isConfirmed, error } = useRelease();

  useTransactionToast(isConfirmed, error, "Funds released to your wallet.");

  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  const isOrganizer = pot && address ? address.toLowerCase() === pot.organizer.toLowerCase() : false;
  const canRelease = pot ? isOrganizer && getPotStatus(pot) === "goalReached" : false;

  // A disconnect (or any eligibility change) mid-flight must not erase an
  // already-submitted transaction's status — only the offer to release
  // depends on current eligibility; a result already in progress doesn't.
  const hasActiveTransaction = isPending || isConfirming || isConfirmed || Boolean(error);

  if (!canRelease && !hasActiveTransaction) return null;

  const isSubmitting = isPending || isConfirming;

  if (!canRelease) {
    return (
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="Funds released to your wallet."
      />
    );
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-neutral-900">Goal reached</h3>
        <p className="text-sm leading-relaxed text-neutral-500">
          This pot hit its goal before the deadline. Release the full balance to your wallet whenever
          you&rsquo;re ready.
        </p>
      </div>
      <button
        onClick={() => release(potId)}
        disabled={isSubmitting}
        className="w-full rounded-full bg-emerald-600 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSubmitting ? "Releasing…" : "Release funds to yourself"}
      </button>
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="Funds released to your wallet."
      />
    </Card>
  );
}

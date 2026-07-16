"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { useRelease } from "@/hooks/useRelease";
import { TransactionStatus } from "./TransactionStatus";

interface ReleaseButtonProps {
  potId: bigint;
}

/** Self-gating: renders nothing unless the connected wallet is the organizer,
 * the goal has been met, the pot isn't already released, and the deadline
 * hasn't passed — mirrors release()'s own require conditions exactly, so a
 * page can just always mount this and trust it to hide itself correctly. */
export function ReleaseButton({ potId }: ReleaseButtonProps) {
  const { address } = useAccount();
  const { pot, refetch } = usePot(potId);
  const { release, hash, isPending, isConfirming, isConfirmed, error } = useRelease();

  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  if (!pot || !address) return null;

  const isOrganizer = address.toLowerCase() === pot.organizer.toLowerCase();
  const targetMet = pot.totalContributed >= pot.targetAmount;
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const beforeDeadline = nowSeconds <= pot.deadline;

  if (!isOrganizer || pot.released || !targetMet || !beforeDeadline) {
    return null;
  }

  const isSubmitting = isPending || isConfirming;

  return (
    <div className="space-y-2">
      <button
        onClick={() => release(potId)}
        disabled={isSubmitting}
        className="w-full rounded-full bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
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
    </div>
  );
}

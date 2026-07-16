"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { useContribution } from "@/hooks/useContribution";
import { useClaimRefund } from "@/hooks/useClaimRefund";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { getPotStatus } from "@/lib/potStatus";
import { formatMon } from "@/lib/format";
import { TransactionStatus } from "./TransactionStatus";

interface ClaimRefundButtonProps {
  potId: bigint;
}

/** Self-gating: renders nothing unless the pot is "refundable" (past deadline,
 * never released — regardless of whether the goal was met, matching the
 * contract's abandoned-organizer fallback) and the connected wallet has a
 * recorded contribution. */
export function ClaimRefundButton({ potId }: ClaimRefundButtonProps) {
  const { address } = useAccount();
  const { pot, refetch: refetchPot } = usePot(potId);
  const { contribution, refetch: refetchContribution } = useContribution(potId);
  const { claimRefund, hash, isPending, isConfirming, isConfirmed, error } = useClaimRefund();

  useTransactionToast(isConfirmed, error, "Refunded to your wallet.");

  useEffect(() => {
    if (isConfirmed) {
      refetchPot();
      refetchContribution();
    }
  }, [isConfirmed, refetchPot, refetchContribution]);

  const canClaim = Boolean(pot && address && getPotStatus(pot) === "refundable" && contribution > 0n);

  // A disconnect (or any eligibility change) mid-flight must not erase an
  // already-submitted transaction's status — only the offer to claim depends
  // on current eligibility; a result already in progress doesn't.
  const hasActiveTransaction = isPending || isConfirming || isConfirmed || Boolean(error);

  if (!canClaim && !hasActiveTransaction) return null;

  const goalWasMet = pot ? pot.totalContributed >= pot.targetAmount : false;
  const isSubmitting = isPending || isConfirming;

  return (
    <div className="space-y-2">
      {canClaim && (
        <>
          <p className="text-sm text-neutral-500">
            {goalWasMet
              ? "This pot reached its goal, but wasn't released before the deadline."
              : "This pot didn't reach its goal in time."}
          </p>
          <button
            onClick={() => claimRefund(potId)}
            disabled={isSubmitting}
            className="w-full rounded-full border border-neutral-300 px-4 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            {isSubmitting ? "Refunding…" : `Get your ${formatMon(contribution)} back`}
          </button>
        </>
      )}
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="Refunded to your wallet."
      />
    </div>
  );
}

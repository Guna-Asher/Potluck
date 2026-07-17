"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { useContribution } from "@/hooks/useContribution";
import { useClaimRefund } from "@/hooks/useClaimRefund";
import { useClaimedRefund } from "@/hooks/useClaimedRefund";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { getPotStatus } from "@/lib/potStatus";
import { formatMon } from "@/lib/format";
import { Card } from "./ui/Card";
import { TransactionStatus } from "./TransactionStatus";

interface ClaimRefundButtonProps {
  potId: bigint;
}

/** Self-gating: renders nothing unless the pot is "refundable" (past deadline,
 * never released — regardless of whether the goal was met, matching the
 * contract's abandoned-organizer fallback) and the connected wallet either
 * has a recorded contribution to claim, or this browser has personally seen
 * it claim one already (see useClaimedRefund — a per-wallet, per-browser
 * acknowledgment, not a global "has everyone claimed" signal: the contract
 * has no aggregate refund counter to derive that from). */
export function ClaimRefundButton({ potId }: ClaimRefundButtonProps) {
  const { address } = useAccount();
  const { pot, refetch: refetchPot } = usePot(potId);
  const { contribution, refetch: refetchContribution } = useContribution(potId);
  const { claimRefund, hash, isPending, isConfirming, isConfirmed, error } = useClaimRefund();
  const { claimed, markClaimed } = useClaimedRefund(potId, address);

  useTransactionToast(isConfirmed, error, "Refunded to your wallet.");

  useEffect(() => {
    if (isConfirmed) {
      refetchPot();
      refetchContribution();
      markClaimed();
    }
  }, [isConfirmed, refetchPot, refetchContribution, markClaimed]);

  const isRefundable = Boolean(pot && getPotStatus(pot) === "refundable");
  const canClaim = Boolean(isRefundable && address && contribution > 0n);

  // A disconnect (or any eligibility change) mid-flight must not erase an
  // already-submitted transaction's status — only the offer to claim depends
  // on current eligibility; a result already in progress doesn't.
  const hasActiveTransaction = isPending || isConfirming || isConfirmed || Boolean(error);

  // contribution reads 0 both for "never contributed" and "already claimed"
  // (claimRefund zeroes it on-chain) — claimed is what disambiguates the two.
  const alreadyClaimed = Boolean(isRefundable && address && claimed);

  if (!canClaim && !hasActiveTransaction && !alreadyClaimed) return null;

  const goalWasMet = pot ? pot.totalContributed >= pot.targetAmount : false;
  const isSubmitting = isPending || isConfirming;

  if (!canClaim) {
    if (hasActiveTransaction) {
      return (
        <TransactionStatus
          hash={hash}
          isPending={isPending}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          error={error}
          confirmedLabel="Refunded to your wallet."
        />
      );
    }

    return (
      <Card className="space-y-1">
        <h3 className="font-semibold text-neutral-900">Refund claimed</h3>
        <p className="text-sm leading-relaxed text-neutral-500">
          You already claimed your refund for this pot — there&rsquo;s nothing left to do here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-neutral-900">Refund available</h3>
        <p className="text-sm leading-relaxed text-neutral-500">
          {goalWasMet
            ? "This pot reached its goal, but wasn't released before the deadline."
            : "This pot didn't reach its goal in time."}{" "}
          You can claim back exactly what you contributed.
        </p>
      </div>
      <button
        onClick={() => claimRefund(potId)}
        disabled={isSubmitting}
        className="w-full rounded-full border border-neutral-300 px-5 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
      >
        {isSubmitting ? "Refunding…" : `Get your ${formatMon(contribution)} back`}
      </button>
      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="Refunded to your wallet."
      />
    </Card>
  );
}

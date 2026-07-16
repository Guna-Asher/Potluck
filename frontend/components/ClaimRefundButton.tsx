"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { useContribution } from "@/hooks/useContribution";
import { useClaimRefund } from "@/hooks/useClaimRefund";
import { formatMon } from "@/lib/format";
import { TransactionStatus } from "./TransactionStatus";

interface ClaimRefundButtonProps {
  potId: bigint;
}

/** Self-gating, mirroring claimRefund()'s own conditions: renders nothing
 * unless the pot has expired, was never released, and the connected wallet
 * actually has a contribution recorded against this pot. */
export function ClaimRefundButton({ potId }: ClaimRefundButtonProps) {
  const { address } = useAccount();
  const { pot, refetch: refetchPot } = usePot(potId);
  const { contribution, refetch: refetchContribution } = useContribution(potId);
  const { claimRefund, hash, isPending, isConfirming, isConfirmed, error } = useClaimRefund();

  useEffect(() => {
    if (isConfirmed) {
      refetchPot();
      refetchContribution();
    }
  }, [isConfirmed, refetchPot, refetchContribution]);

  if (!pot || !address) return null;

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const potExpired = nowSeconds > pot.deadline;

  if (pot.released || !potExpired || contribution === 0n) {
    return null;
  }

  const isSubmitting = isPending || isConfirming;

  return (
    <div className="space-y-2">
      <button
        onClick={() => claimRefund(potId)}
        disabled={isSubmitting}
        className="w-full rounded-full border border-neutral-300 px-4 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
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
    </div>
  );
}

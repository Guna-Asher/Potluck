"use client";

import { useCallback } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { POTLUCK_ABI, POTLUCK_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chain";

export function useClaimRefund() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const claimRefund = useCallback(
    (potId: bigint) => {
      writeContract({
        address: POTLUCK_ADDRESS,
        abi: POTLUCK_ABI,
        functionName: "claimRefund",
        args: [potId],
        chainId: monadTestnet.id,
      });
    },
    [writeContract]
  );

  return { claimRefund, hash, isPending, isConfirming, isConfirmed, error, reset };
}

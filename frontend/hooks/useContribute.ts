"use client";

import { useCallback } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { POTLUCK_ABI, POTLUCK_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chain";

export function useContribute() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const contribute = useCallback(
    (potId: bigint, amount: bigint) => {
      writeContract({
        address: POTLUCK_ADDRESS,
        abi: POTLUCK_ABI,
        functionName: "contribute",
        args: [potId],
        value: amount,
        chainId: monadTestnet.id,
      });
    },
    [writeContract]
  );

  return { contribute, hash, isPending, isConfirming, isConfirmed, error, reset };
}

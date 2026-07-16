"use client";

import { useCallback, useMemo } from "react";
import { parseEventLogs } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { POTLUCK_ABI, POTLUCK_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chain";

/** Creates a pot, then decodes the resulting potId from the PotCreated log
 * in the transaction receipt (a sent transaction has no direct return value —
 * only a simulated call would, so the event log is the reliable source). */
export function useCreatePot() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  const createPot = useCallback(
    (title: string, description: string, targetAmount: bigint, deadline: bigint) => {
      writeContract({
        address: POTLUCK_ADDRESS,
        abi: POTLUCK_ABI,
        functionName: "createPot",
        args: [title, description, targetAmount, deadline],
        chainId: monadTestnet.id,
      });
    },
    [writeContract]
  );

  const potId = useMemo(() => {
    if (!receipt) return undefined;
    const [event] = parseEventLogs({
      abi: POTLUCK_ABI,
      eventName: "PotCreated",
      logs: receipt.logs,
    });
    return event?.args.potId;
  }, [receipt]);

  return { createPot, hash, potId, isPending, isConfirming, isConfirmed, error, reset };
}

"use client";

import { useAccount, useReadContract } from "wagmi";
import { POTLUCK_ABI, POTLUCK_ADDRESS } from "@/lib/contract";

const POLL_INTERVAL_MS = 4_000;

/** The connected wallet's own contribution to a pot — used to decide whether
 * to show that wallet a Refund button. */
export function useContribution(potId: bigint | undefined) {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: POTLUCK_ADDRESS,
    abi: POTLUCK_ABI,
    functionName: "getContribution",
    args: potId !== undefined && address ? [potId, address] : undefined,
    query: {
      enabled: potId !== undefined && Boolean(address),
      refetchInterval: POLL_INTERVAL_MS,
    },
  });

  return { contribution: data ?? 0n, isLoading, refetch };
}

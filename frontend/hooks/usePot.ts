"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { POTLUCK_ABI, POTLUCK_ADDRESS } from "@/lib/contract";

export interface Pot {
  organizer: `0x${string}`;
  title: string;
  description: string;
  targetAmount: bigint;
  deadline: bigint;
  totalContributed: bigint;
  contributorCount: bigint;
  released: boolean;
}

const POLL_INTERVAL_MS = 4_000;

/** Single source of truth for a pot's live state. Every component that needs
 * pot data reads it through this hook so there is exactly one polling loop. */
export function usePot(potId: bigint | undefined) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: POTLUCK_ADDRESS,
    abi: POTLUCK_ABI,
    functionName: "getPot",
    args: potId !== undefined ? [potId] : undefined,
    query: {
      enabled: potId !== undefined,
      refetchInterval: POLL_INTERVAL_MS,
    },
  });

  // Memoized on `data` so consumers get a stable reference between renders
  // that don't carry a new read result — without this, every render (even one
  // triggered by something unrelated) hands back a brand-new object, which
  // breaks any effect that depends on `pot` as a whole (see PotPage).
  const pot: Pot | undefined = useMemo(() => {
    if (!data) return undefined;
    return {
      organizer: data[0],
      title: data[1],
      description: data[2],
      targetAmount: data[3],
      deadline: data[4],
      totalContributed: data[5],
      contributorCount: data[6],
      released: data[7],
    };
  }, [data]);

  return { pot, isLoading, isError, refetch };
}

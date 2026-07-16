import type { Pot } from "@/hooks/usePot";

export type PotStatus = "active" | "goalReached" | "released" | "refundable";

/** Single source of truth for a pot's lifecycle state, mirroring the
 * contract's own require conditions exactly (see src/Potluck.sol):
 * release() only works goalReached-and-before-deadline; claimRefund() only
 * works after the deadline regardless of whether the goal was met. Every
 * component that needs to know "what state is this pot in" reads it from
 * here so the badge and the action buttons can never disagree. */
export function getPotStatus(pot: Pot): PotStatus {
  if (pot.released) return "released";

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  if (nowSeconds > pot.deadline) return "refundable";
  if (pot.totalContributed >= pot.targetAmount) return "goalReached";
  return "active";
}

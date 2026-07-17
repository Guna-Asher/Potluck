"use client";

import { useCallback, useEffect, useState } from "react";
import { hasClaimedLocally, recordClaimedLocally } from "@/lib/claimedRefunds";

/** Whether *this browser* has already seen the connected wallet successfully
 * claim a refund for this pot — a personal, local acknowledgment, not a
 * global signal (see lib/claimedRefunds.ts).
 *
 * localStorage isn't available during SSR, so this only reads after mount —
 * same pattern as usePotHistory. */
export function useClaimedRefund(potId: bigint | undefined, address: string | undefined) {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (potId === undefined || !address) {
      setClaimed(false);
      return;
    }
    setClaimed(hasClaimedLocally(potId.toString(), address));
  }, [potId, address]);

  const markClaimed = useCallback(() => {
    if (potId === undefined || !address) return;
    recordClaimedLocally(potId.toString(), address);
    setClaimed(true);
  }, [potId, address]);

  return { claimed, markClaimed };
}

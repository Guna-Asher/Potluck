"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshIcon } from "./ui/icons";

/** Refetches every active contract read on the page in one tap. wagmi keys
 * all of them under the "readContract" query-key prefix, so invalidating that
 * prefix re-syncs pot state, the wallet's contribution, and every eligibility
 * check derived from them — no page reload, so scroll position and any
 * in-progress form input survive. */
export function RefreshButton() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["readContract"] });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh pot data"
      title="Refresh pot data"
      className="rounded-full border border-neutral-200 p-2.5 text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
    >
      <RefreshIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  );
}

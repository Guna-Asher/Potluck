"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  );
}

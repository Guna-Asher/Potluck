"use client";

import { useEffect } from "react";
import { useToast } from "@/components/Toast";
import { getFriendlyErrorMessage, isUserRejection } from "@/lib/format";

/** Fires a toast on a write-hook's terminal state — shared by every
 * create/contribute/release/refund flow so the confirmation/error moment
 * looks and feels identical across the app. Inline TransactionStatus still
 * shows the persistent in-flight state and the explorer link; this just adds
 * the immediate, attention-grabbing confirmation on top. */
export function useTransactionToast(isConfirmed: boolean, error: unknown, successMessage: string) {
  const { showToast } = useToast();

  useEffect(() => {
    if (isConfirmed) showToast(successMessage, "success");
  }, [isConfirmed, showToast, successMessage]);

  useEffect(() => {
    // A wallet rejection is the user's own choice, not a failure — inform
    // without alarming.
    if (error) showToast(getFriendlyErrorMessage(error), isUserRejection(error) ? "neutral" : "error");
  }, [error, showToast]);
}

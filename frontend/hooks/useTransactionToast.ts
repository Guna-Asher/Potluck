"use client";

import { useEffect } from "react";
import { useToast } from "@/components/Toast";
import { getFriendlyErrorMessage } from "@/lib/format";

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
    if (error) showToast(getFriendlyErrorMessage(error), "error");
  }, [error, showToast]);
}

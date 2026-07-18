"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getFriendlyErrorMessage, isUserRejection } from "@/lib/format";
import { ExplorerLink } from "./ExplorerLink";

interface TransactionStatusProps {
  hash?: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: unknown;
  confirmedLabel?: string;
}

/** The one place a raw wagmi/viem transaction state gets turned into copy a
 * non-crypto user can read — used by every write-flow component. Each state
 * transition (pending → confirming → confirmed/error) gets a small fade so
 * the status doesn't just snap between messages. */
export function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isConfirmed,
  error,
  confirmedLabel = "Done.",
}: TransactionStatusProps) {
  const state = error ? "error" : isPending ? "pending" : isConfirming ? "confirming" : isConfirmed ? "confirmed" : "idle";

  return (
    <AnimatePresence mode="wait">
      {state === "error" && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`text-sm ${isUserRejection(error) ? "text-neutral-500" : "text-red-600"}`}
        >
          {getFriendlyErrorMessage(error)}
        </motion.p>
      )}

      {state === "pending" && (
        <motion.p
          key="pending"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm text-neutral-500"
        >
          Confirm in MetaMask…
        </motion.p>
      )}

      {state === "confirming" && (
        <motion.div
          key="confirming"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2 text-sm text-neutral-500"
        >
          <span>Waiting for confirmation…</span>
          <ExplorerLink hash={hash} />
        </motion.div>
      )}

      {state === "confirmed" && (
        <motion.div
          key="confirmed"
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-2 text-sm text-emerald-700"
        >
          <span>{confirmedLabel}</span>
          <ExplorerLink hash={hash} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

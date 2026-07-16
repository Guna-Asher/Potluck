import { getFriendlyErrorMessage } from "@/lib/format";
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
 * non-crypto user can read — used by every write-flow component. */
export function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isConfirmed,
  error,
  confirmedLabel = "Done.",
}: TransactionStatusProps) {
  if (error) {
    return <p className="text-sm text-red-600">{getFriendlyErrorMessage(error)}</p>;
  }

  if (isPending) {
    return <p className="text-sm text-neutral-500">Confirm in MetaMask…</p>;
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span>Waiting for confirmation…</span>
        <ExplorerLink hash={hash} />
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <span>{confirmedLabel}</span>
        <ExplorerLink hash={hash} />
      </div>
    );
  }

  return null;
}

import { POTLUCK_ADDRESS } from "@/lib/contract";
import { monadMainnet } from "@/lib/chain";
import { ShieldIcon } from "./ui/icons";

/** Quiet custody signal for the money page: says where the funds actually
 * sit and links to the verified contract. Deliberately small and muted —
 * a footnote of fact, not a marketing banner. */
export function EscrowTrustRow() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-neutral-100/70 px-4 py-3 text-xs leading-relaxed text-neutral-500">
      <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <p>
        Funds are held by a verified escrow contract. No one can withdraw them early, and refunds
        never expire.{" "}
        <a
          href={`${monadMainnet.blockExplorers.default.url}/address/${POTLUCK_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-800"
        >
          View on Monadscan
        </a>
      </p>
    </div>
  );
}

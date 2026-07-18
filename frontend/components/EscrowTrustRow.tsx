import { POTLUCK_ADDRESS } from "@/lib/contract";
import { monadMainnet } from "@/lib/chain";

/** Quiet custody signal for the money page: says where the funds actually
 * sit and links to the verified contract. Deliberately small and muted —
 * a footnote of fact, not a marketing banner. */
export function EscrowTrustRow() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-neutral-100/70 px-4 py-3 text-xs leading-relaxed text-neutral-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
      <p>
        Funds are held by a verified escrow contract — no one can withdraw them early, and refunds
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

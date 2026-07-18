import { monadMainnet } from "@/lib/chain";
import { truncateAddress } from "@/lib/format";

interface PotHeaderProps {
  title: string;
  description: string;
  organizer: `0x${string}`;
  /** True when the connected wallet is this pot's organizer — swaps the
   * "Organized by 0x…" chip for direct address ("You're the organizer"). */
  isViewerOrganizer?: boolean;
}

export function PotHeader({ title, description, organizer, isViewerOrganizer = false }: PotHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      {description && <p className="text-base leading-relaxed text-neutral-500">{description}</p>}
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          isViewerOrganizer ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
        }`}
      >
        <span>{isViewerOrganizer ? "You're the organizer" : `Organized by ${truncateAddress(organizer)}`}</span>
        <a
          href={`${monadMainnet.blockExplorers.default.url}/address/${organizer}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700"
        >
          View
        </a>
      </div>
    </div>
  );
}

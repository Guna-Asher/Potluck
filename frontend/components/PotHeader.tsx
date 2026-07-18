import { monadMainnet } from "@/lib/chain";

interface PotHeaderProps {
  title: string;
  description: string;
  organizer: `0x${string}`;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function PotHeader({ title, description, organizer }: PotHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      {description && <p className="text-base leading-relaxed text-neutral-500">{description}</p>}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
        <span>Organized by {truncateAddress(organizer)}</span>
        <a
          href={`${monadMainnet.blockExplorers.default.url}/address/${organizer}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700"
        >
          view
        </a>
      </div>
    </div>
  );
}

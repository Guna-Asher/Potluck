import { monadTestnet } from "@/lib/chain";

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
    <div className="space-y-1.5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      {description && <p className="text-neutral-500">{description}</p>}
      <p className="text-xs text-neutral-400">
        Organized by {truncateAddress(organizer)} ·{" "}
        <a
          href={`${monadTestnet.blockExplorers.default.url}/address/${organizer}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
        >
          view
        </a>
      </p>
    </div>
  );
}

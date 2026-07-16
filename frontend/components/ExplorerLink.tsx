import { monadTestnet } from "@/lib/chain";

interface ExplorerLinkProps {
  hash?: `0x${string}`;
  address?: `0x${string}`;
  label?: string;
}

export function ExplorerLink({ hash, address, label }: ExplorerLinkProps) {
  if (!hash && !address) return null;

  const explorerBase = monadTestnet.blockExplorers.default.url;
  const href = hash ? `${explorerBase}/tx/${hash}` : `${explorerBase}/address/${address}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-800"
    >
      {label ?? "View on Explorer"}
    </a>
  );
}

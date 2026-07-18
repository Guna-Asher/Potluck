"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { monadMainnet } from "@/lib/chain";

/** A non-blocking banner — the real enforcement happens at the wagmi layer
 * (every write hook targets monadMainnet.id explicitly, which triggers
 * MetaMask's own network-switch prompt). This just explains why, up front. */
export function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === monadMainnet.id) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span>You&rsquo;re connected to a different network. Switch to Monad Mainnet to use Potluck.</span>
      <button
        onClick={() => switchChain({ chainId: monadMainnet.id })}
        disabled={isPending}
        className="whitespace-nowrap rounded-full bg-amber-900 px-3 py-1.5 font-medium text-white transition-colors hover:bg-amber-800 disabled:opacity-50"
      >
        {isPending ? "Switching…" : "Switch network"}
      </button>
    </div>
  );
}

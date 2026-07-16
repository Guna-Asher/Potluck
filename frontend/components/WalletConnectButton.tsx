"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useToast } from "./Toast";
import { getFriendlyErrorMessage } from "@/lib/format";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { showToast } = useToast();

  // Surfaces connection failures (rejected in MetaMask, MetaMask not
  // installed, etc.) — previously silent, since `error` wasn't read at all.
  useEffect(() => {
    if (error) showToast(getFriendlyErrorMessage(error), "error");
  }, [error, showToast]);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
          {truncateAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const metaMaskConnector = connectors[0];

  return (
    <button
      onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector })}
      disabled={isPending}
      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}

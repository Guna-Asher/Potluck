import Link from "next/link";
import { WalletConnectButton } from "./WalletConnectButton";

export function NavBar() {
  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
          P
        </span>
        <span className="hidden sm:inline">Potluck</span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/pots"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          My Pots
        </Link>
        <WalletConnectButton />
      </nav>
    </header>
  );
}

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
        <a
          href="https://github.com/Guna-Asher/Potluck"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.4-5.28 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
        </a>
        <WalletConnectButton />
      </nav>
    </header>
  );
}

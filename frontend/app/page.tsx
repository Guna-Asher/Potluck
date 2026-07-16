import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { POTLUCK_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chain";

const STEPS = [
  {
    title: "Create a pot",
    description: "Set a title, a MON goal, and a deadline. Deployed onchain in one transaction.",
  },
  {
    title: "Share the link",
    description: "One URL. Anyone can open it and see live progress — no account needed.",
  },
  {
    title: "Contribute",
    description: "Friends chip in any amount toward the goal, straight from their own wallet.",
  },
  {
    title: "Release or refund",
    description: "Goal met in time → the organizer releases the funds. Goal missed → everyone gets refunded.",
  },
];

const TRUST_PILLARS = [
  {
    title: "No custodian",
    description: "Contributions sit in the contract, not in anyone's wallet, until the goal is met or the deadline passes.",
  },
  {
    title: "Verified & immutable",
    description: "The contract's source is public and verified on Monadscan. No admin key, no upgrade path.",
  },
  {
    title: "Every transaction public",
    description: "Every create, contribute, release, and refund is a transaction anyone can inspect — including you.",
  },
];

const USE_CASES = [
  {
    icon: "🏖️",
    title: "Trip or Airbnb",
    description: "Splitting a rental for a weekend away? Share the link and stop fronting the deposit alone.",
  },
  {
    icon: "🎫",
    title: "Concert or event tickets",
    description: "Coordinate a group booking without one card taking the full hit if plans fall through.",
  },
  {
    icon: "🎁",
    title: "Group gifts",
    description: "Chip in for a gift together — if the group doesn't hit the goal, nobody's out the money they sent.",
  },
  {
    icon: "📦",
    title: "Bulk or team orders",
    description: "Collect everyone's share before you commit to buying, not after.",
  },
];

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center"
        >
          <div className="h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 pt-12 sm:items-center sm:pt-20 sm:text-center lg:pt-28">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Live on Monad Testnet
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              Contract verified
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            Stop being the friend group&rsquo;s bank.
          </h1>

          <p className="max-w-xl text-lg text-neutral-500 sm:text-xl">
            Create a shared pot, set a goal and a deadline. Hit the goal in time and the organizer
            releases the funds. Miss it, and every contributor is refunded automatically — no one
            has to ask.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/create"
              className="rounded-full bg-neutral-900 px-7 py-3.5 text-center font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Start a pot
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-neutral-200 px-7 py-3.5 text-center font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              See how it works
            </a>
          </div>

          <p className="text-sm text-neutral-400">
            No signup to view a pot &nbsp;·&nbsp; Secured by smart contract escrow &nbsp;·&nbsp;
            Every transaction verifiable onchain
          </p>
        </div>

        {/* Abstract escrow flow — illustrates the mechanism, not live data */}
        <div className="mx-auto mt-14 max-w-4xl px-6 sm:mt-20">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-0">
            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-center shadow-sm sm:flex-1">
              <p className="text-sm font-medium text-neutral-900">Contributors</p>
              <p className="mt-0.5 text-xs text-neutral-400">Send MON toward the goal</p>
            </div>

            <div className="flex items-center justify-center py-1 sm:w-12 sm:py-0">
              <span className="text-neutral-300 sm:rotate-0" aria-hidden>
                <span className="hidden sm:inline">─→</span>
                <span className="sm:hidden">↓</span>
              </span>
            </div>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center shadow-sm sm:flex-1">
              <p className="text-sm font-semibold text-emerald-800">Smart Contract Escrow</p>
              <p className="mt-0.5 text-xs text-emerald-700/70">Holds the pot until goal or deadline</p>
            </div>

            <div className="flex items-center justify-center py-1 sm:w-12 sm:py-0">
              <span className="text-neutral-300" aria-hidden>
                <span className="hidden sm:inline">─→</span>
                <span className="sm:hidden">↓</span>
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-center shadow-sm sm:flex-1">
              <p className="text-sm font-medium text-neutral-900">Organizer or contributors</p>
              <p className="mt-0.5 text-xs text-neutral-400">Released, or refunded automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-4xl scroll-mt-20 px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-3 sm:items-center sm:text-center">
          <span className="text-sm font-medium text-emerald-700">How it works</span>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            From shared expense to settled pot in four steps
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="space-y-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="font-semibold text-neutral-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <div className="flex flex-col gap-3 sm:items-center sm:text-center">
            <span className="text-sm font-medium text-emerald-700">Trust</span>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Funds secured by smart contract escrow
            </h2>
            <p className="max-w-xl text-neutral-500 sm:text-lg">
              Nobody holds the money in between — not the organizer, not Potluck. The contract
              does, and its rules can&rsquo;t change after the fact.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {TRUST_PILLARS.map((pillar) => (
              <div key={pillar.title} className="space-y-2 rounded-2xl border border-neutral-100 p-5 sm:p-6">
                <h3 className="font-semibold text-neutral-900">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href={`${monadTestnet.blockExplorers.default.url}/address/${POTLUCK_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              View verified contract
              <code className="text-neutral-400">{truncateAddress(POTLUCK_ADDRESS)}</code>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto w-full max-w-4xl px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-3 sm:items-center sm:text-center">
          <span className="text-sm font-medium text-emerald-700">Built for real groups</span>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Wherever a group needs to pool money
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {USE_CASES.map((useCase) => (
            <Card key={useCase.title} className="flex items-start gap-4">
              <span className="text-2xl" aria-hidden>
                {useCase.icon}
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-900">{useCase.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{useCase.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-neutral-900">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 py-20 sm:items-center sm:py-28 sm:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stop fronting the money. Start a pot.
          </h2>
          <p className="max-w-md text-neutral-400">
            Free to try on Monad Testnet. No signup, no custodian, no chasing people down.
          </p>
          <Link
            href="/create"
            className="rounded-full bg-white px-7 py-3.5 text-center font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Start a pot
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-4 text-sm text-neutral-400 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
              P
            </span>
            <span>Potluck — built for the Monad BuildAnything Hackathon</span>
          </div>
          <a
            href={`${monadTestnet.blockExplorers.default.url}/address/${POTLUCK_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
          >
            Contract on Monadscan
          </a>
        </div>
      </footer>
    </main>
  );
}

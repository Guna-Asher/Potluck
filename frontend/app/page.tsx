import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/landing/Reveal";
import { CountUpNumber } from "@/components/landing/CountUpNumber";
import { HeroPotPreview } from "@/components/landing/HeroPotPreview";
import { POTLUCK_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chain";

const STEPS = [
  {
    title: "Create a pot",
    description: "Set a title, a MON goal, and a deadline. It goes live in one transaction.",
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

const CREDIBILITY_ITEMS = ["Contract Verified", "Live on Monad Testnet", "Open Source (MIT)", "No Admin Keys"];

const TRUST_POINTS = [
  "No one holds your money — it sits in the pot until it's paid out or refunded.",
  "Nobody can change the rules once a pot is live — not the organizer, not us.",
  "Every pot, every payment, every payout is public. Check it yourself, any time.",
];

const USE_CASES = [
  {
    quote: "“Nobody wants to book the Airbnb until everyone's actually paid.”",
    context: "Trip deposits",
  },
  {
    quote: "“One person's card is eating the risk if the show gets cancelled.”",
    context: "Concert tickets",
  },
  {
    quote: "“We all said we'd chip in for the gift — two people never did.”",
    context: "Group gifts",
  },
];

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const explorerUrl = `${monadTestnet.blockExplorers.default.url}/address/${POTLUCK_ADDRESS}`;

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

        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 pt-16 sm:items-center sm:pt-24 sm:text-center lg:pt-32">
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
            No sign-up to peek at a pot &nbsp;·&nbsp; No one can walk off with the money &nbsp;·&nbsp;
            Every payment is out in the open
          </p>
        </div>

        {/* A real preview of the actual product UI, not a diagram. */}
        <div className="mx-auto mt-16 max-w-4xl px-6 sm:mt-24">
          <HeroPotPreview />
        </div>
      </section>

      {/* Credibility strip — a short, dense band, deliberately not a full section */}
      <section className="border-y border-neutral-200/70 bg-white py-8 sm:py-10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2.5 px-6 sm:gap-3">
          <Reveal
            delay={0}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700"
          >
            <span className="text-emerald-600">
              <CheckIcon />
            </span>
            <CountUpNumber value={52} className="tabular-nums" /> Contract Tests Passing
          </Reveal>
          {CREDIBILITY_ITEMS.map((label, index) => (
            <Reveal
              key={label}
              delay={(index + 1) * 0.06}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700"
            >
              <span className="text-emerald-600">
                <CheckIcon />
              </span>
              {label}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Problem — one statement, one comparison, deliberately not a card grid */}
      <section className="relative mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-3xl"
        />
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="max-w-lg text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl">
            There&rsquo;s always one person who ends up eating the risk.
          </p>

          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            <div className="w-full rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-400 line-through decoration-neutral-300">
              One person pays. Then spends two weeks chasing everyone else.
            </div>
            <span className="text-neutral-300" aria-hidden>
              ↓
            </span>
            <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800">
              Everyone pays in. The pot decides when the money moves.
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-4xl scroll-mt-20 px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-3 sm:items-center sm:text-center">
          <span className="text-sm font-medium text-emerald-700">How it works</span>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            How a pot goes from empty to paid out
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <Card className="h-full space-y-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{step.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust — the section doing the most work, so it gets the most room,
          a dark background, and a direct path back into the product. */}
      <section className="relative overflow-hidden bg-neutral-900 py-28 sm:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
        >
          <div className="h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-sm font-medium text-emerald-400">Trust</span>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              No one can walk off with the money
            </h2>
          </div>

          <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
            {TRUST_POINTS.map((point, index) => (
              <Reveal key={point} delay={index * 0.1} className="flex items-start gap-4 py-6 sm:items-center sm:py-7">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 sm:mt-0">
                  <CheckIcon />
                </span>
                <p className="text-base text-neutral-200 sm:text-lg">{point}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <Link
              href="/create"
              className="rounded-full bg-white px-7 py-3.5 text-center font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
            >
              Start a pot
            </Link>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 underline decoration-neutral-600 underline-offset-2 transition-colors hover:text-neutral-200"
            >
              or see the code for yourself
              <code className="text-neutral-500">{truncateAddress(POTLUCK_ADDRESS)}</code>
            </a>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto w-full max-w-4xl px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-3 sm:items-center sm:text-center">
          <span className="text-sm font-medium text-emerald-700">Sound familiar?</span>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            This is the group chat every time
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {USE_CASES.map((useCase, index) => (
            <Reveal key={useCase.context} delay={index * 0.08} className="border-l-2 border-emerald-200 pl-5">
              <p className="text-lg leading-snug text-neutral-800">{useCase.quote}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-neutral-400">{useCase.context}</p>
            </Reveal>
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
            Free to try right now. No sign-up, no middleman, no chasing anyone down.
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              P
            </span>
            <span>Potluck — a simple way to split money with a group</span>
          </div>
          <a
            href={explorerUrl}
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

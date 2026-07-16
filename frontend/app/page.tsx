import Link from "next/link";
import { ExplorerLink } from "@/components/ExplorerLink";
import { Card } from "@/components/ui/Card";
import { POTLUCK_ADDRESS } from "@/lib/contract";

const STEPS = [
  {
    title: "Create a pot",
    description: "Name it, set a goal in MON, and pick a deadline. Takes about 30 seconds.",
  },
  {
    title: "Share the link",
    description: "Everyone opens the same link, connects a wallet, and contributes their share.",
  },
  {
    title: "Release or refund — automatically",
    description:
      "Hit the goal in time and the organizer releases the funds. Miss it, and everyone gets refunded. No one has to ask.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 pb-24 pt-4 sm:gap-20 sm:pt-12">
      <section className="flex flex-col items-start gap-6 sm:items-center sm:text-center">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Live on Monad Testnet
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Collect money from a group without becoming the group&rsquo;s debt collector.
        </h1>
        <p className="max-w-xl text-lg text-neutral-500">
          Potluck pools contributions into a pot that only pays out if the goal is met — and
          refunds everyone automatically if it isn&rsquo;t. No one ever holds the money but the
          contract itself.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/create"
            className="rounded-full bg-neutral-900 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Start a pot
          </Link>
          <Link
            href="/pots"
            className="rounded-full border border-neutral-200 px-6 py-3 text-center font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            View my pots
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step, index) => (
          <Card key={step.title} className="space-y-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="font-semibold text-neutral-900">{step.title}</h3>
            <p className="text-sm text-neutral-500">{step.description}</p>
          </Card>
        ))}
      </section>

      <Card className="text-center sm:p-10">
        <h2 className="text-xl font-semibold text-neutral-900">Nobody holds your money but the contract.</h2>
        <p className="mx-auto mt-2 max-w-lg text-neutral-500">
          Not the organizer, not Potluck. Every pot is escrowed on-chain and only ever released or
          refunded by code — you can verify every transaction yourself.
        </p>
        <div className="mt-4">
          <ExplorerLink address={POTLUCK_ADDRESS} label="View the contract on Monadscan" />
        </div>
      </Card>
    </main>
  );
}

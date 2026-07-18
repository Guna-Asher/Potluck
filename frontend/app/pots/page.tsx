"use client";

import Link from "next/link";
import { usePotHistory } from "@/hooks/usePotHistory";
import { PotCard } from "@/components/PotCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EXAMPLE_POT_ID } from "@/lib/contract";
import { PotIcon } from "@/components/ui/icons";

export default function PotsPage() {
  const { entries } = usePotHistory();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10 sm:py-16">
      <PageHeader
        title="My pots"
        subtitle="Pots you've created or opened on this device. Clearing your browser data resets this list."
        action={
          <Link
            href="/create"
            className="whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            + New pot
          </Link>
        }
      />

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <PotIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold text-neutral-900">No pots on this device yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
            Pots you create or open will show up here automatically.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
            <Link
              href="/create"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Start a pot
            </Link>
            <Link
              href={`/pot/${EXAMPLE_POT_ID}`}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              See a live example pot →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {entries.map((entry) => (
            <PotCard key={entry.potId} potId={BigInt(entry.potId)} role={entry.role} fallbackTitle={entry.title} />
          ))}
        </div>
      )}
    </main>
  );
}

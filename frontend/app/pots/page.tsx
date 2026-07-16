"use client";

import Link from "next/link";
import { usePotHistory } from "@/hooks/usePotHistory";
import { PotCard } from "@/components/PotCard";

export default function PotsPage() {
  const { entries } = usePotHistory();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">My pots</h1>
          <p className="text-sm text-neutral-500">
            Pots you&rsquo;ve created or opened on this device. Clearing your browser data resets this
            list.
          </p>
        </div>
        <Link
          href="/create"
          className="whitespace-nowrap rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          + New pot
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
          <p className="text-neutral-500">No pots yet.</p>
          <Link href="/create" className="mt-2 inline-block font-medium text-emerald-700 hover:underline">
            Create your first pot →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <PotCard key={entry.potId} potId={BigInt(entry.potId)} role={entry.role} fallbackTitle={entry.title} />
          ))}
        </div>
      )}
    </main>
  );
}

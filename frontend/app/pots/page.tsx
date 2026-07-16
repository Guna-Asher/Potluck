"use client";

import Link from "next/link";
import { usePotHistory } from "@/hooks/usePotHistory";
import { PotCard } from "@/components/PotCard";
import { PageHeader } from "@/components/ui/PageHeader";

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
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <p className="text-neutral-500">No pots yet.</p>
          <Link href="/create" className="mt-2 inline-block font-medium text-emerald-700 hover:underline">
            Create your first pot →
          </Link>
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

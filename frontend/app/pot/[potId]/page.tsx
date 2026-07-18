"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { usePot } from "@/hooks/usePot";
import { usePotHistory } from "@/hooks/usePotHistory";
import { PotHeader } from "@/components/PotHeader";
import { PotProgress } from "@/components/PotProgress";
import { ContributeForm } from "@/components/ContributeForm";
import { ReleaseButton } from "@/components/ReleaseButton";
import { ClaimRefundButton } from "@/components/ClaimRefundButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { RefreshButton } from "@/components/RefreshButton";
import { getPotStatus } from "@/lib/potStatus";

export default function PotPage() {
  const params = useParams<{ potId: string }>();
  const { address } = useAccount();
  const { record } = usePotHistory();

  const potId = useMemo(() => {
    try {
      return BigInt(params.potId);
    } catch {
      return undefined;
    }
  }, [params.potId]);

  const { pot, isLoading, isError, refetch } = usePot(potId);

  // Depend on the primitive fields the effect actually uses, not the whole
  // `pot` object — `pot` gets a new reference on every successful poll (every
  // 4s) even when nothing changed, which would otherwise re-run this effect,
  // call record(), update state, and re-render indefinitely.
  const potTitle = pot?.title;
  const potOrganizer = pot?.organizer;

  useEffect(() => {
    if (potId === undefined || !potTitle || !potOrganizer) return;
    const isOrganizer = address ? address.toLowerCase() === potOrganizer.toLowerCase() : false;
    record(potId.toString(), potTitle, isOrganizer ? "organizer" : "contributor");
  }, [potId, potTitle, potOrganizer, address, record]);

  const remainingAmount =
    pot && pot.targetAmount > pot.totalContributed ? pot.targetAmount - pot.totalContributed : undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-6 py-10 sm:py-16">
      {potId === undefined && <p className="text-neutral-500">That doesn&rsquo;t look like a valid pot link.</p>}

      {potId !== undefined && isLoading && <p className="text-neutral-500">Loading pot…</p>}

      {potId !== undefined && isError && (
        <p className="text-neutral-500">We couldn&rsquo;t find that pot. Double-check the link.</p>
      )}

      {pot && potId !== undefined && (
        <>
          {/* Informational block — what this pot is and where it stands */}
          <div className="space-y-5">
            <PotHeader title={pot.title} description={pot.description} organizer={pot.organizer} />
            <PotProgress pot={pot} />
            <div className="flex items-center gap-2">
              <CopyLinkButton key={`copy-${potId}`} potId={potId} />
              <RefreshButton />
            </div>
          </div>

          {/* Action zone — what you can do about it right now */}
          <div className="space-y-4 border-t border-neutral-200 pt-6">
            {/* Contributing is only ever contractually valid while the pot is
                still open — showing this form once refunds are available would
                directly contradict the status badge above it. */}
            {(getPotStatus(pot) === "active" || getPotStatus(pot) === "goalReached") && (
              <ContributeForm
                key={`contribute-${potId}`}
                potId={potId}
                remainingAmount={remainingAmount}
                onSuccess={refetch}
              />
            )}

            <ReleaseButton key={`release-${potId}`} potId={potId} />
            <ClaimRefundButton key={`refund-${potId}`} potId={potId} />

            {pot.released && (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center">
                <p className="text-neutral-500">🎉 All done here.</p>
                <Link href="/create" className="mt-1 inline-block font-medium text-emerald-700 hover:underline">
                  Create another pot →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

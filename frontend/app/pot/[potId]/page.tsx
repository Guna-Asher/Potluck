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
import { EscrowTrustRow } from "@/components/EscrowTrustRow";
import { LiveIndicator } from "@/components/LiveIndicator";
import { PotSkeleton } from "@/components/PotSkeleton";
import { getPotStatus } from "@/lib/potStatus";
import { formatMon } from "@/lib/format";

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

  const { pot, isLoading, isError, refetch, dataUpdatedAt } = usePot(potId);

  // Depend on the primitive fields the effect actually uses, not the whole
  // `pot` object — `pot` gets a new reference on every successful poll (every
  // 4s) even when nothing changed, which would otherwise re-run this effect,
  // call record(), update state, and re-render indefinitely.
  const potTitle = pot?.title;
  const potOrganizer = pot?.organizer;

  const isViewerOrganizer = Boolean(
    address && potOrganizer && address.toLowerCase() === potOrganizer.toLowerCase()
  );

  useEffect(() => {
    if (potId === undefined || !potTitle || !potOrganizer) return;
    const isOrganizer = address ? address.toLowerCase() === potOrganizer.toLowerCase() : false;
    record(potId.toString(), potTitle, isOrganizer ? "organizer" : "contributor");
  }, [potId, potTitle, potOrganizer, address, record]);

  const remainingAmount =
    pot && pot.targetAmount > pot.totalContributed ? pot.targetAmount - pot.totalContributed : undefined;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:py-16">
      {potId === undefined && <p className="text-neutral-500">That doesn&rsquo;t look like a valid pot link.</p>}

      {potId !== undefined && isLoading && <PotSkeleton />}

      {potId !== undefined && isError && (
        <p className="text-neutral-500">We couldn&rsquo;t find that pot. Double-check the link.</p>
      )}

      {pot && potId !== undefined && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-12">
          {/* Informational column — what this pot is and where it stands */}
          <div className="space-y-5">
            <PotHeader
              title={pot.title}
              description={pot.description}
              organizer={pot.organizer}
              isViewerOrganizer={isViewerOrganizer}
            />
            <PotProgress pot={pot} />
            <EscrowTrustRow />
          </div>

          {/* Action rail — what you can do about it right now. Sticky on
              desktop so the actions stay in reach while reading; on mobile it
              stacks below the info column behind the same divider as before. */}
          <div className="space-y-4 border-t border-neutral-200 pt-6 lg:sticky lg:top-8 lg:border-t-0 lg:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <CopyLinkButton key={`copy-${potId}`} potId={potId} />
              <RefreshButton />
              <span className="ml-auto">
                <LiveIndicator updatedAt={dataUpdatedAt} />
              </span>
            </div>

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
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-3 font-semibold text-emerald-900">Paid out</h3>
                <p className="mt-1 text-sm tabular-nums text-emerald-800">
                  {formatMon(pot.totalContributed)} was released to the organizer.
                </p>
                <Link
                  href="/create"
                  className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
                >
                  Create another pot →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

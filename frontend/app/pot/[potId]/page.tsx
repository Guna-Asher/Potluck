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
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-5 px-6 py-8 sm:py-12">
      {potId === undefined && <p className="text-neutral-500">That doesn&rsquo;t look like a valid pot link.</p>}

      {potId !== undefined && isLoading && <p className="text-neutral-500">Loading pot…</p>}

      {potId !== undefined && isError && (
        <p className="text-neutral-500">We couldn&rsquo;t find that pot. Double-check the link.</p>
      )}

      {pot && potId !== undefined && (
        <>
          <PotHeader title={pot.title} description={pot.description} organizer={pot.organizer} />

          <PotProgress pot={pot} />

          <CopyLinkButton potId={potId} />

          {!pot.released && (
            <ContributeForm potId={potId} remainingAmount={remainingAmount} onSuccess={refetch} />
          )}

          <ReleaseButton potId={potId} />
          <ClaimRefundButton potId={potId} />

          {pot.released && (
            <div className="rounded-2xl border border-dashed border-neutral-200 p-5 text-center">
              <p className="text-neutral-500">🎉 All done here.</p>
              <Link href="/create" className="mt-1 inline-block font-medium text-emerald-700 hover:underline">
                Create another pot →
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
}

"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePot } from "@/hooks/usePot";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { NetworkGuard } from "@/components/NetworkGuard";
import { PotHeader } from "@/components/PotHeader";
import { PotProgress } from "@/components/PotProgress";
import { ContributeForm } from "@/components/ContributeForm";
import { ReleaseButton } from "@/components/ReleaseButton";
import { ClaimRefundButton } from "@/components/ClaimRefundButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";

export default function PotPage() {
  const params = useParams<{ potId: string }>();

  const potId = useMemo(() => {
    try {
      return BigInt(params.potId);
    } catch {
      return undefined;
    }
  }, [params.potId]);

  const { pot, isLoading, isError, refetch } = usePot(potId);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold">Potluck</span>
        <WalletConnectButton />
      </header>

      <NetworkGuard />

      {potId === undefined && <p className="text-neutral-500">That doesn&rsquo;t look like a valid pot link.</p>}

      {potId !== undefined && isLoading && <p className="text-neutral-500">Loading pot…</p>}

      {potId !== undefined && isError && (
        <p className="text-neutral-500">We couldn&rsquo;t find that pot. Double-check the link.</p>
      )}

      {pot && potId !== undefined && (
        <>
          <PotHeader title={pot.title} description={pot.description} />

          <PotProgress
            totalContributed={pot.totalContributed}
            targetAmount={pot.targetAmount}
            deadline={pot.deadline}
            contributorCount={pot.contributorCount}
            released={pot.released}
          />

          <CopyLinkButton potId={potId} />

          {!pot.released && <ContributeForm potId={potId} onSuccess={refetch} />}

          <ReleaseButton potId={potId} />
          <ClaimRefundButton potId={potId} />
        </>
      )}
    </main>
  );
}

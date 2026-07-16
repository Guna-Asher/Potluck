"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { useContribute } from "@/hooks/useContribute";
import { parseMon } from "@/lib/format";
import { TransactionStatus } from "./TransactionStatus";

interface ContributeFormProps {
  potId: bigint;
  onSuccess?: () => void;
}

export function ContributeForm({ potId, onSuccess }: ContributeFormProps) {
  const { isConnected } = useAccount();
  const { contribute, hash, isPending, isConfirming, isConfirmed, error } = useContribute();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isConfirmed) {
      setAmount("");
      onSuccess?.();
    }
  }, [isConfirmed, onSuccess]);

  const isSubmitting = isPending || isConfirming;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!amount) return;
    contribute(potId, parseMon(amount));
  };

  return (
    <form className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <label htmlFor="amount" className="text-sm font-medium text-neutral-700">
        Chip in
      </label>
      <div className="flex gap-2">
        <input
          id="amount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in MON"
          required
          className="flex-1 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={!isConnected || isSubmitting}
          className="whitespace-nowrap rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Contribute"}
        </button>
      </div>

      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="You're in — thanks for chipping in."
      />
    </form>
  );
}

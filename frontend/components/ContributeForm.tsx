"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { useContribute } from "@/hooks/useContribute";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { formatMon, parseMon } from "@/lib/format";
import { TransactionStatus } from "./TransactionStatus";
import { useToast } from "./Toast";

interface ContributeFormProps {
  potId: bigint;
  remainingAmount?: bigint;
  onSuccess?: () => void;
}

export function ContributeForm({ potId, remainingAmount, onSuccess }: ContributeFormProps) {
  const { isConnected } = useAccount();
  const { contribute, hash, isPending, isConfirming, isConfirmed, error } = useContribute();
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");

  useTransactionToast(isConfirmed, error, "You're in — thanks for chipping in.");

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

    // Native number inputs accept values (e.g. scientific notation like
    // "1e21") that parseEther can't handle — without this guard, a throw
    // here would silently abort the submission with zero user feedback.
    let parsedAmount: bigint;
    try {
      parsedAmount = parseMon(amount);
    } catch {
      showToast("That doesn't look like a valid amount.", "error");
      return;
    }

    if (parsedAmount <= 0n) {
      showToast("Enter an amount greater than zero.", "error");
      return;
    }

    contribute(potId, parsedAmount);
  };

  return (
    <form
      className="space-y-4 rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card sm:p-7"
      onSubmit={handleSubmit}
    >
      <div className="flex items-baseline justify-between">
        <label htmlFor="amount" className="text-sm font-medium text-neutral-700">
          Chip in
        </label>
        {remainingAmount !== undefined && remainingAmount > 0n && (
          <span className="text-xs tabular-nums text-neutral-400">{formatMon(remainingAmount)} still needed</span>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="amount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in MON"
          required
          className="flex-1 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-4 focus:ring-neutral-900/5"
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

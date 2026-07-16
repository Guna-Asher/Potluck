"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useCreatePot } from "@/hooks/useCreatePot";
import { useTransactionToast } from "@/hooks/useTransactionToast";
import { minDatetimeLocalValue, parseMon } from "@/lib/format";
import { TransactionStatus } from "./TransactionStatus";

export function CreatePotForm() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createPot, hash, potId, isPending, isConfirming, isConfirmed, error } = useCreatePot();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // "Now" as a floor so the picker won't offer a past moment — the contract's
  // own DeadlineInPast check is the real enforcement; any future time is valid.
  const minDeadline = useMemo(() => minDatetimeLocalValue(0), []);

  useTransactionToast(isConfirmed, error, "Pot created!");

  useEffect(() => {
    if (isConfirmed && potId !== undefined) {
      router.push(`/pot/${potId.toString()}`);
    }
  }, [isConfirmed, potId, router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setDeadlineError(null);
    if (!title.trim() || !goal || !deadline) return;

    const deadlineDate = new Date(deadline);

    if (deadlineDate.getTime() <= Date.now()) {
      setDeadlineError("Pick a deadline that's in the future.");
      return;
    }

    const deadlineTimestamp = BigInt(Math.floor(deadlineDate.getTime() / 1000));
    createPot(title.trim(), description.trim(), parseMon(goal), deadlineTimestamp);
  };

  const isSubmitting = isPending || isConfirming;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-neutral-700">
          What are you collecting for?
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Beach house weekend"
          required
          maxLength={80}
          className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none focus:border-neutral-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-neutral-700">
          Add a few details <span className="text-neutral-400">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="6 people, splitting the rental for the weekend of Aug 8th"
          rows={2}
          maxLength={280}
          className="w-full resize-none rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none focus:border-neutral-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="goal" className="text-sm font-medium text-neutral-700">
            Goal (MON)
          </label>
          <input
            id="goal"
            type="number"
            min="0"
            step="any"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="1200"
            required
            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none focus:border-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="deadline" className="text-sm font-medium text-neutral-700">
            Deadline
          </label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            min={minDeadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              setDeadlineError(null);
            }}
            required
            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-neutral-900 outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      {deadlineError && <p className="text-sm text-red-600">{deadlineError}</p>}

      <button
        type="submit"
        disabled={!isConnected || isSubmitting}
        className="w-full rounded-full bg-neutral-900 px-4 py-3 font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
      >
        {!isConnected ? "Connect your wallet to start a pot" : isSubmitting ? "Creating…" : "Create pot"}
      </button>

      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        confirmedLabel="Pot created — taking you there now…"
      />
    </form>
  );
}

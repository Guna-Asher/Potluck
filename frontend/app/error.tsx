"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Something went wrong</h1>
        <p className="text-neutral-500">
          That wasn&rsquo;t supposed to happen. Your money&rsquo;s safe — nothing was sent. Give it another try.
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-full bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Try again
      </button>
    </main>
  );
}

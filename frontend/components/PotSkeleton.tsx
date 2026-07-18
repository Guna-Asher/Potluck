/** Loading placeholder for the pot page, shaped like the real layout
 * (header, progress card, action rail) so the page doesn't jump when data
 * lands. One gentle pulse, no shimmer gradients. */
export function PotSkeleton() {
  return (
    <div role="status" aria-label="Loading pot">
      <div
        aria-hidden
        className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-12"
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-lg bg-neutral-200" />
            <div className="h-4 w-full max-w-md rounded bg-neutral-200/70" />
            <div className="h-6 w-44 rounded-full bg-neutral-200/70" />
          </div>
          <div className="space-y-5 rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card sm:p-7">
            <div className="h-10 w-44 rounded-lg bg-neutral-200" />
            <div className="h-3 w-full rounded-full bg-neutral-100" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-neutral-200/70" />
              <div className="h-4 w-20 rounded bg-neutral-200/70" />
            </div>
          </div>
          <div className="h-11 rounded-xl bg-neutral-100" />
        </div>
        <div className="hidden space-y-4 lg:block">
          <div className="h-10 w-48 rounded-full bg-neutral-200/70" />
          <div className="h-44 rounded-2xl border border-neutral-200/70 bg-white shadow-card" />
        </div>
      </div>
    </div>
  );
}

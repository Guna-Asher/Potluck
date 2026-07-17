"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { parseEther } from "viem";
import { PotProgress } from "@/components/PotProgress";
import type { Pot } from "@/hooks/usePot";

// Not a real, callable address — never linked out to, only ever displayed as
// text, so there's nothing here for a visitor to mistake for a real pot.
const DEMO_ORGANIZER = "0x71C76B4394024Ce301AC4e58189B4C60cCa2656" as const;

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Renders the real PotProgress component (unmodified — the same one that
 * powers /pot/[potId]) against an illustrative, clearly-labeled example pot,
 * instead of an abstract diagram. Proves the product's actual UI exists
 * rather than describing it. The deadline is computed relative to render
 * time so "days left" never goes stale. */
export function HeroPotPreview() {
  const reduceMotion = useReducedMotion();

  const demoPot: Pot = useMemo(() => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    return {
      organizer: DEMO_ORGANIZER,
      title: "Beach house weekend",
      description: "6 people, splitting the rental for the weekend of Aug 8th",
      targetAmount: parseEther("15"),
      totalContributed: parseEther("12"),
      deadline: BigInt(nowSeconds + 2 * 86_400 + 14 * 3_600),
      contributorCount: 6n,
      released: false,
    };
  }, []);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md"
      animate={
        reduceMotion
          ? undefined
          : { y: [0, -8, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
      }
      whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <span className="absolute -top-3 left-6 z-10 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white shadow-sm">
        Example pot
      </span>

      <div className="space-y-3">
        <div className="rounded-2xl border border-neutral-200/70 bg-white px-6 py-4 shadow-card">
          <h3 className="font-semibold text-neutral-900">{demoPot.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-neutral-400">
            Organized by {truncateAddress(demoPot.organizer)}
          </p>
        </div>

        <PotProgress pot={demoPot} />
      </div>
    </motion.div>
  );
}

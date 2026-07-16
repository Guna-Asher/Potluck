"use client";

import { useCallback, useEffect, useState } from "react";
import { getPotHistory, recordPotVisit, type PotHistoryEntry, type PotRole } from "@/lib/potHistory";

export function usePotHistory() {
  const [entries, setEntries] = useState<PotHistoryEntry[]>([]);

  // localStorage isn't available during SSR, so this only reads after mount —
  // matches the fact that every page touching wallet state is client-only anyway.
  useEffect(() => {
    setEntries(getPotHistory());
  }, []);

  const record = useCallback((potId: string, title: string, role: PotRole) => {
    setEntries(recordPotVisit({ potId, title, role }));
  }, []);

  return { entries, record };
}

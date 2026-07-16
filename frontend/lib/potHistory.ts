export type PotRole = "organizer" | "contributor";

export interface PotHistoryEntry {
  potId: string; // bigint isn't JSON-serializable, so IDs are stored as strings
  title: string;
  role: PotRole;
  lastVisited: number; // ms epoch, used for sort order
}

const STORAGE_KEY = "potluck:history";

// localStorage can be hand-edited, shared across app versions with a
// different schema, or partially written — never trust its shape blindly.
// Consumers (e.g. PotsPage calling BigInt(entry.potId)) rely on every entry
// here being well-formed, so invalid rows are dropped at the source instead
// of crashing whoever reads them first.
function isValidEntry(value: unknown): value is PotHistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;

  if (typeof entry.potId !== "string" || !/^\d+$/.test(entry.potId)) return false;
  if (typeof entry.title !== "string") return false;
  if (entry.role !== "organizer" && entry.role !== "contributor") return false;
  if (typeof entry.lastVisited !== "number") return false;

  return true;
}

function readHistory(): PotHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: PotHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Pots this browser has created or opened, newest first. This is a client-side
 * convenience only — there is no indexer, so it reflects this device's history,
 * not a full on-chain record of every pot tied to a wallet. */
export function getPotHistory(): PotHistoryEntry[] {
  return readHistory().sort((a, b) => b.lastVisited - a.lastVisited);
}

/** Upserts a pot into the history (by potId), refreshing its role/title/timestamp. */
export function recordPotVisit(entry: Omit<PotHistoryEntry, "lastVisited">): PotHistoryEntry[] {
  const others = readHistory().filter((existing) => existing.potId !== entry.potId);
  const updated = [...others, { ...entry, lastVisited: Date.now() }];
  writeHistory(updated);
  return updated.sort((a, b) => b.lastVisited - a.lastVisited);
}

// Chain-scoped (143 = Monad Mainnet): a "potId:address" claim seen on the old
// testnet contract says nothing about the same-numbered mainnet pot, so keys
// recorded there must never surface here.
const STORAGE_KEY = "potluck:143:claimedRefunds";

// A flat list of "potId:address" keys this browser has personally seen a
// successful refund claim for. Address is lowercased so the same wallet is
// recognized regardless of checksum casing.
//
// This is a client-side convenience only, same caveat as potHistory.ts: it
// reflects what this browser has witnessed, not a global record. The
// contract itself has no aggregate "has this address claimed" getter (see
// README's "Known Limitations & What's Next"), so a claim made from a
// different browser or device won't show up here — the UI is written to
// fall back to showing nothing rather than assert a false "still available"
// or a false "already claimed" when it simply doesn't know.
function claimKey(potId: string, address: string): string {
  return `${potId}:${address.toLowerCase()}`;
}

// localStorage can be hand-edited, shared across app versions with a
// different schema, or partially written — never trust its shape blindly.
function readClaimed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")
      ? new Set(parsed)
      : new Set();
  } catch {
    return new Set();
  }
}

function writeClaimed(claimed: Set<string>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...claimed]));
}

export function hasClaimedLocally(potId: string, address: string): boolean {
  return readClaimed().has(claimKey(potId, address));
}

export function recordClaimedLocally(potId: string, address: string): void {
  const claimed = readClaimed();
  claimed.add(claimKey(potId, address));
  writeClaimed(claimed);
}

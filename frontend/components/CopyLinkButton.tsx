"use client";

import { useState } from "react";
import { useToast } from "./Toast";

interface CopyLinkButtonProps {
  potId: bigint;
}

export function CopyLinkButton({ potId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const url = `${window.location.origin}/pot/${potId.toString()}`;

    // navigator.clipboard is unavailable in some non-secure contexts and
    // restrictive in-app browser webviews — without this guard, a rejection
    // here was an unhandled promise rejection with zero user feedback.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Couldn't copy automatically. Copy the link from your address bar instead.", "error");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
    >
      {copied ? "Link copied!" : "Copy link to share"}
    </button>
  );
}

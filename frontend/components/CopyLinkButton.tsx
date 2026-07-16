"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  potId: bigint;
}

export function CopyLinkButton({ potId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/pot/${potId.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

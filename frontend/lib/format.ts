import { BaseError, ContractFunctionRevertedError, formatEther, parseEther } from "viem";

export function formatMon(value: bigint): string {
  const asNumber = Number(formatEther(value));
  return `${asNumber.toLocaleString(undefined, { maximumFractionDigits: 4 })} MON`;
}

export function parseMon(value: string): bigint {
  return parseEther(value);
}

export function calculateProgress(totalContributed: bigint, targetAmount: bigint): number {
  if (targetAmount === 0n) return 0;
  const percentage = (Number(totalContributed) / Number(targetAmount)) * 100;
  return Math.min(percentage, 100);
}

export function isExpired(deadline: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) > deadline;
}

// Local-time string (no timezone) for a <input type="datetime-local"> min attribute.
export function minDatetimeLocalValue(minutesFromNow: number): string {
  const date = new Date(Date.now() + minutesFromNow * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatCountdown(deadline: bigint): string {
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  if (deadline <= nowSeconds) return "Closed";

  const totalSeconds = Number(deadline - nowSeconds);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  if (minutes > 0) return `${minutes}m left`;
  return "Closing soon";
}

// Maps the contract's custom errors (see src/Potluck.sol) to plain language.
// This is the only place a raw error name should ever be translated for display.
const ERROR_MESSAGES: Record<string, string> = {
  InvalidPotId: "We couldn't find that pot.",
  DeadlineInPast: "Pick a deadline that's in the future.",
  ZeroTarget: "The goal needs to be more than zero.",
  AlreadyReleased: "This pot has already been paid out.",
  DeadlinePassed: "This pot is closed — the deadline has passed.",
  DeadlineNotReached: "Refunds open up once the deadline passes.",
  ZeroValue: "Enter an amount greater than zero.",
  NotOrganizer: "Only the person who created this pot can release it.",
  TargetNotMet: "This pot hasn't reached its goal yet.",
  NoContribution: "It looks like you haven't put anything into this pot.",
  TransferFailed: "The transfer didn't go through. Please try again.",
};

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    const revertError = error.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName;
      if (errorName && ERROR_MESSAGES[errorName]) {
        return ERROR_MESSAGES[errorName];
      }
    }

    if (error.shortMessage.toLowerCase().includes("user rejected")) {
      return "Cancelled.";
    }

    return error.shortMessage;
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

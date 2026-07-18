import { getAddress } from "viem";

// Monad Mainnet deployment. Deployed once, finalized — set immediately after
// running the deployment checklist, then never edited again.
// MAINNET_DEPLOY: replace the zero-address placeholder with the address printed
// by `forge script script/Deploy.s.sol:Deploy --rpc-url monad_mainnet ...`.
// (The previous Monad Testnet instance lives at
// 0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1 and is unaffected.)
export const POTLUCK_ADDRESS = getAddress("0x38777e7308398B4D91E1359fF2ac08148AE9A6b0");

// A real pot that was funded and released on mainnet ("Weekend Practice",
// 2/2 MON, 2 contributors, released) — linked from the landing hero and the
// /pots empty state as a live, verifiable example of the success path.
export const EXAMPLE_POT_ID = "4";

export const POTLUCK_ABI = [
  {
    inputs: [],
    name: "AlreadyReleased",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "potId", type: "uint256" }],
    name: "claimRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "potId", type: "uint256" }],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "targetAmount", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "createPot",
    outputs: [{ internalType: "uint256", name: "potId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "DeadlineInPast",
    type: "error",
  },
  {
    inputs: [],
    name: "DeadlineNotReached",
    type: "error",
  },
  {
    inputs: [],
    name: "DeadlinePassed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPotId",
    type: "error",
  },
  {
    inputs: [],
    name: "NoContribution",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOrganizer",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "potId", type: "uint256" }],
    name: "release",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "TargetNotMet",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroTarget",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroValue",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "potId", type: "uint256" },
      { indexed: true, internalType: "address", name: "contributor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newTotal", type: "uint256" },
    ],
    name: "Contributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "potId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "uint256", name: "targetAmount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "PotCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "potId", type: "uint256" },
      { indexed: true, internalType: "address", name: "contributor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Refunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "potId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Released",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "potId", type: "uint256" },
      { internalType: "address", name: "contributor", type: "address" },
    ],
    name: "getContribution",
    outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "potId", type: "uint256" }],
    name: "getPot",
    outputs: [
      { internalType: "address", name: "organizer", type: "address" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "targetAmount", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "totalContributed", type: "uint256" },
      { internalType: "uint256", name: "contributorCount", type: "uint256" },
      { internalType: "bool", name: "released", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

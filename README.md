# Potluck

**Stop being the friend group's bank.**

Potluck is a trustless, onchain escrow for group money pools. Create a pot, share a link, and let a smart contract — not a person — decide whether the money gets released or refunded.

[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet-836EF9?style=flat-square)](https://testnet.monadscan.com/address/0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1)
[![Contract Verified](https://img.shields.io/badge/Contract-Verified-brightgreen?style=flat-square)](https://testnet.monadscan.com/address/0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.24-363636?style=flat-square&logo=solidity)](./src/Potluck.sol)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](./frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[Live Demo](#) · [Demo Video](#) · [Contract on Monadscan](https://testnet.monadscan.com/address/0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1)

> 🎥 **Demo video:** `[link to be added]`
> 🔗 **Live app:** `[link to be added]`

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Why Blockchain Is Actually Needed](#why-blockchain-is-actually-needed)
- [Features](#features)
- [Screenshots](#screenshots)
- [User Flow](#user-flow)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [Hackathon Submission](#hackathon-submission)
- [License](#license)

---

## The Problem

Group money is always the same story: a trip house, concert tickets, an Airbnb, a shared gift, a bulk order. One person fronts the full cost, then spends the next two weeks chasing everyone else for their share.

Tools like Splitwise help you track *who owes what* — but they don't move money, and they can't enforce anything. Payment apps like Venmo move money, but once you send it, it's gone. There's no concept of "collect from everyone by Friday, or give it all back."

The organizer is always the one holding the risk: if the plan falls through after they've already paid a non-refundable deposit, they eat the loss alone.

## The Solution

Potluck replaces the honor system with a smart contract.

1. **Create a pot** — name it, set a funding goal in MON, and pick a deadline.
2. **Share the link** — one URL, no app download, no account creation.
3. **Friends contribute** — anyone with a wallet can chip in any amount toward the goal.
4. **One of two outcomes, enforced by code:**
   - **Goal met before the deadline** → the organizer releases the full pot to themselves.
   - **Goal missed** → every contributor claims back exactly what they put in — no request, no approval, no organizer involved.

Nobody — not the organizer, not Potluck — ever has custody of the money in between. The contract does.

## Why Blockchain Is Actually Needed

This isn't blockchain for its own sake. The core guarantee — *"the money either goes to the organizer under the agreed conditions, or comes back to me, and neither of us can change that"* — is exactly the kind of neutral, tamper-proof custody a smart contract is for.

| Without a blockchain | With Potluck |
|---|---|
| The organizer holds the money — contributors must trust them not to spend it or disappear | The contract holds the money — no individual ever has custody |
| A payment company could hold funds, but takes a cut and sets its own refund policy | Refund logic is public, immutable code — not a company's discretion |
| "I'll pay you back if it doesn't work out" is a promise | Refund eligibility is a `require` statement, not a promise |
| Trust has to be established in every new group, every time | Trust is in the contract, verifiable by anyone, every time |

Monad specifically makes this practical for casual group use: sub-second finality and low fees mean a $10 contribution doesn't feel like a chore, and a group of 8 people each sending a small transaction is fast and cheap enough to actually feel like Venmo.

## Features

- **Create funding pots** — title, description, MON goal, and deadline, deployed onchain in one transaction
- **Shareable links** — a pot's ID is the whole URL; anyone can open it and see live status with no login
- **MetaMask integration** — wallet connect, network detection, and guided network switching to Monad Testnet
- **Live contribution tracking** — progress bar, amount raised, contributor count, and time remaining, read directly from the chain
- **Goal-based release** — the organizer releases the full pot only once the goal is met and only before the deadline
- **Automatic refund eligibility** — once the deadline passes without release, every contributor can reclaim their exact contribution
- **Explorer links on every transaction** — every create, contribute, release, and refund links straight to Monadscan
- **Multiple pots per organizer** — no limit on how many pots a single wallet can create or contribute to
- **Pot history** — a local, per-device record of pots you've created or opened, so you can find your way back to them
- **Fully onchain escrow** — no backend, no database of balances; the contract's state is the only source of truth

## Screenshots

![Landing Page](./docs/screenshots/landing.png)

![Create Pot](./docs/screenshots/create-pot.png)

![Pot Details](./docs/screenshots/pot-details.png)

![Contribution Flow](./docs/screenshots/contribution.png)

![Funds Released](./docs/screenshots/release.png)

## User Flow

```mermaid
sequenceDiagram
    actor Organizer
    actor Contributor
    participant App as Potluck (Frontend)
    participant Contract as Potluck.sol (Monad Testnet)

    Organizer->>App: Connect wallet
    Organizer->>App: Create pot (title, goal, deadline)
    App->>Contract: createPot(...)
    Contract-->>App: PotCreated event (potId)
    App-->>Organizer: Shareable link

    Organizer->>Contributor: Share link

    Contributor->>App: Open link
    Contributor->>App: Connect wallet
    Contributor->>App: Contribute MON
    App->>Contract: contribute(potId)
    Contract-->>App: Contributed event

    alt Goal met before deadline
        Organizer->>App: Release funds
        App->>Contract: release(potId)
        Contract-->>Organizer: Transfers full balance
    else Deadline passes, goal not met
        Contributor->>App: Claim refund
        App->>Contract: claimRefund(potId)
        Contract-->>Contributor: Transfers original contribution
    end
```

## Architecture

Potluck is deliberately a two-tier system: a smart contract that owns every money-movement decision, and a static frontend that only reads and writes to that contract. There is no backend server and no database — the chain is the only source of truth for pot state and balances.

```mermaid
flowchart TD
    subgraph Client["Browser"]
        UI["Next.js App (React 19)"]
        Wagmi["wagmi + viem"]
        MM["MetaMask Extension"]
    end

    subgraph Chain["Monad Testnet"]
        Contract["Potluck.sol\n(verified, immutable)"]
    end

    Explorer["Monadscan Explorer"]

    UI -->|read/write calls| Wagmi
    Wagmi -->|JSON-RPC| MM
    MM -->|signed transactions| Contract
    Wagmi -->|polling reads| Contract
    Contract -.->|verified source + tx history| Explorer
    UI -.->|"View on Explorer" links| Explorer
```

**Frontend** — Next.js (App Router) + TypeScript. Two content routes (`/create`, `/pot/[potId]`) plus a local pot-history dashboard (`/pots`). Every number shown — amount raised, goal, deadline, contributor count — is read live from the contract, not cached in a database.

**Smart Contract** — a single Solidity contract deployed once to Monad Testnet, holding every pot as a struct in a mapping. It is the sole source of truth for money and state transitions.

**Monad Testnet** — chain ID `10143`. Chosen for fast finality and low fees, which matter when a "pot" might involve a dozen small contributions from a friend group.

**MetaMask** — the only supported wallet for this build. Connection, network detection/switching, and transaction signing all go through wagmi's MetaMask connector.

## Smart Contract

| | |
|---|---|
| **Address** | [`0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1`](https://testnet.monadscan.com/address/0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1) |
| **Network** | Monad Testnet (chain ID `10143`) |
| **Verified** | ✅ Yes — source, ABI, and exact-match bytecode on Monadscan |
| **Currency** | Native MON (18 decimals) — no ERC-20, no approvals |
| **Source** | [`src/Potluck.sol`](./src/Potluck.sol) |

### Core functions

| Function | Access | Purpose |
|---|---|---|
| `createPot(title, description, targetAmount, deadline)` | Anyone | Registers a new pot; caller becomes the organizer |
| `contribute(potId)` | Anyone, before deadline | Adds `msg.value` MON to the pot's balance |
| `release(potId)` | Organizer only, before deadline, goal met | Pays the full pot balance to the organizer |
| `claimRefund(potId)` | Any contributor, after deadline | Returns exactly what that address contributed |
| `getPot(potId)` | Anyone (view) | Reads a pot's full state |
| `getContribution(potId, address)` | Anyone (view) | Reads one address's contribution to a pot |

### Escrow logic

The entire contract balances on one deliberate rule: **`release()` only works at or before the deadline.** Once the deadline passes, `release()` is permanently unavailable and `claimRefund()` is the only remaining path — regardless of whether the goal was actually met. An organizer who goes silent after the goal is hit is functionally identical to a failed pot from a contributor's point of view, and the contract treats it that way automatically, with no separate "abandoned organizer" branch required.

Contributions are tracked per-address (not as a single boolean), so refunds return exactly what each contributor put in — overfunding, underfunding, and repeat contributions from the same address are all handled without special-casing.

### Security design

- **Checks-effects-interactions** in both `release()` and `claimRefund()` — state (`released` flag, or the caller's zeroed contribution) is written *before* the external MON transfer, so a reentrant call from a malicious recipient hits an already-updated guard instead of draining funds.
- **Low-level `.call` with explicit success check** for every transfer, reverting with `TransferFailed` on failure, rather than relying on `.transfer()`'s fixed gas stipend.
- **Custom errors** (`InvalidPotId`, `NotOrganizer`, `TargetNotMet`, `DeadlinePassed`, `DeadlineNotReached`, `AlreadyReleased`, `NoContribution`, `ZeroTarget`, `ZeroValue`, `TransferFailed`, `DeadlineInPast`) instead of require-strings — cheaper on Monad's gas model and self-documenting for auditors.
- **No admin, no upgradeability, no pause switch** — the contract is immutable by design. Removing every centralization point was a deliberate tradeoff in favor of the "no one controls the funds" claim, not an oversight.
- **Pull-based refunds** — each contributor claims their own refund independently; there is no "refund everyone in a loop" function, which would otherwise be a gas-griefing vector as the contributor count grows.

**Test suite:** 52 tests across unit, edge-case, security, and reentrancy suites (`test/`), covering every function, every custom error, and active reentrancy attempts via purpose-built attacker contracts. 100% branch coverage on `src/Potluck.sol`.

```bash
forge test        # run the full suite
forge coverage --report summary --no-match-coverage "script|test/utils"
```

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity ^0.8.24, Foundry |
| Frontend framework | Next.js 15 (App Router), React 19, TypeScript |
| Chain interaction | wagmi v3, viem |
| Wallet | MetaMask (via wagmi's `metaMask()` connector) |
| Styling | Tailwind CSS v4 |
| Data fetching | @tanstack/react-query (via wagmi) |
| Network | Monad Testnet |
| Explorer | Monadscan |

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- MetaMask browser extension
- MON testnet tokens ([Monad testnet faucet](https://testnet.monad.xyz/))

### Smart contract

```bash
# Clone the repo
git clone https://github.com/<your-org>/potluck.git
cd potluck

# Install Foundry dependencies
forge install

# Compile
forge build

# Run the full test suite
forge test -vv

# Check coverage
forge coverage --report summary --no-match-coverage "script|test/utils"
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run the dev server
npm run dev
```

Visit `http://localhost:3000`.

```bash
# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
npm run start
```

## Environment Variables

**Contract deployment** (`.env` at the project root, see `.env.example`):

| Variable | Description |
|---|---|
| `PRIVATE_KEY` | Deployer wallet private key (testnet only — never commit this) |
| `MONAD_TESTNET_RPC_URL` | RPC endpoint used for deployment (default: `https://testnet-rpc.monad.xyz/`) |
| `MONADSCAN_API_KEY` | API key for contract verification on Monadscan |

**Frontend** (`frontend/.env.local`, see `frontend/.env.local.example`):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MONAD_RPC_URL` | RPC endpoint the frontend reads/writes through (default: `https://testnet-rpc.monad.xyz/`) |

The contract address and ABI are not environment variables — they're committed constants in [`frontend/lib/contract.ts`](./frontend/lib/contract.ts), since this build targets one specific, already-deployed, immutable contract.

## Deployment

**Smart contract** — already deployed and verified on Monad Testnet at the address above. To deploy your own instance:

```bash
source .env
forge script script/Deploy.s.sol:Deploy \
  --rpc-url monad_testnet \
  --broadcast \
  --verify \
  -vvvv
```

This deploys `Potluck.sol` and verifies it on Monadscan. If you deploy a new instance, update `POTLUCK_ADDRESS` in `frontend/lib/contract.ts` accordingly.

**Frontend** — a standard Next.js app; deploy to Vercel, Netlify, or any Node-compatible host:

```bash
cd frontend
npm run build
npm run start
```

Set `NEXT_PUBLIC_MONAD_RPC_URL` in your hosting provider's environment settings.

## Project Structure

```
potluck/
├── src/
│   └── Potluck.sol              # The escrow contract
├── script/
│   └── Deploy.s.sol             # Foundry deployment script
├── test/
│   ├── Potluck.t.sol            # Unit + happy-path tests
│   ├── PotluckEdgeCases.t.sol   # Boundary conditions
│   ├── PotluckSecurity.t.sol    # Access control, griefing, invariants
│   ├── PotluckReentrancy.t.sol  # Active reentrancy attempts
│   └── utils/
│       └── Attackers.sol        # Test-double attacker contracts
├── foundry.toml
└── frontend/
    ├── app/
    │   ├── page.tsx              # Landing page
    │   ├── create/page.tsx       # Create-pot flow
    │   ├── pot/[potId]/page.tsx  # Pot detail / tracker
    │   ├── pots/page.tsx         # Local pot-history dashboard
    │   ├── layout.tsx
    │   ├── providers.tsx         # wagmi + react-query + toast providers
    │   └── error.tsx             # Global error boundary
    ├── components/                # UI components (forms, buttons, cards, badges)
    ├── hooks/                     # Contract read/write hooks
    ├── lib/                       # Contract config, chain config, formatting, pot status/history
    └── package.json
```

## Security Notes

- The contract has been tested, not formally audited. It has not been used with real (mainnet) funds.
- This is a **testnet** deployment. MON on Monad Testnet has no monetary value; the demo proves the mechanism, not a live financial guarantee.
- The contract is immutable — there is no upgrade path, no admin key, and no pause function. Any future changes require a new deployment and migrating pots manually; this is a deliberate design choice, not a gap.
- The frontend is a pure client for the contract: it has no backend, no database of balances, and no ability to misrepresent contract state to a user who checks Monadscan directly.
- MetaMask is the only supported wallet in this build. No embedded wallets, no session keys, no gas sponsorship — every transaction is signed explicitly by the user.

## Future Improvements

- ERC-20 / stablecoin support (USDC) alongside native MON
- Organizer-configurable minimum contribution amounts
- Gas sponsorship for first-time, non-crypto-native contributors
- An indexer-backed activity feed (current pot history is local-device only, via `localStorage`)
- Multi-chain deployment
- A formal third-party audit before any mainnet deployment

## Hackathon Submission

Built solo for the **Monad BuildAnything Hackathon**.

| | |
|---|---|
| **Demo video** | `[link to be added]` |
| **Live app** | `[link to be added]` |
| **Contract address** | [`0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1`](https://testnet.monadscan.com/address/0xA4C72147682a2E56A5e4344befcB5eddec2fa3a1) |
| **Network** | Monad Testnet |
| **Team** | Solo builder |

## License

Licensed under the [MIT License](./LICENSE).

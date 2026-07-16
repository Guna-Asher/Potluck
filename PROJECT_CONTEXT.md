Name: Potluck

Problem: Someone always has to be the group's bank. They front hundreds or thousands of dollars for a shared purchase and become an unpaid debt collector, while the rest of the group treats "I'll pay you back" as optional. If the plan collapses, the organizer is stuck with a non-refundable charge.

Existing Workaround: Front the cost personally, then chase via Venmo/Zelle/PayPal requests and group-chat reminders, tracked (maybe) in Splitwise.

Why Existing Solutions Are Not Good Enough: Splitwise only records who owes what after money is spent — it moves no money and enforces nothing. Venmo/Zelle move money but have no concept of "collect from 8 people by Friday or refund everyone," no deadline, no escrow, and no protection: once you pay, it's gone, and requests are trivially ignored. Group-payment tools like SquadTrip exist but are aimed at professional trip organizers, charge card fees, and act as a company that holds your money. Nothing lets a casual friend group pool money into a neutral pot that automatically pays out only if the goal is met and automatically refunds everyone if it isn't.

Product: A shared "pot" you create in 30 seconds: name it ("Coldplay tickets — 6 people"), set the target amount, the per-person share, and a deadline. You get one link. Friends open it, log in with email/Apple/Google, and pay their share in dollars (USDC under the hood) with Apple Pay-style simplicity. Everyone sees a live tracker: who's paid, who hasn't, how close the pot is to its goal. If the pot fills by the deadline, the organizer can release it (to buy the tickets / withdraw to their bank). If it doesn't fill, every contributor is automatically refunded in full — no one has to ask.

User Journey:


Maya creates a pot: "Beach house — $1,200, 6 people, $200 each, deadline Sunday."
She shares the link in the group chat.
Each friend taps the link, signs in with email, and pays $200; an embedded wallet is created invisibly and Maya's app sponsors the gas so they pay exactly $200.
The tracker updates in real time; the app auto-nudges anyone who hasn't paid.
If the pot reaches $1,200 by Sunday, Maya releases the funds and books the house (or cashes out via Circle/CCTP to her bank).
If only $800 comes in, the contract refunds all four who paid — automatically, the moment the deadline passes. Nobody is out of pocket and nobody had to trust Maya to hold the money.


Minimal Onchain Component: A single escrow smart contract per pot on Monad, denominated in USDC. It stores: the target amount, each contributor's address and amount, and the deadline. It enforces exactly two conditional outcomes — release-to-organizer if total ≥ target before the deadline, or refund-all if not. That's it. This belongs onchain rather than in a database because the contract itself is the neutral custodian: no company and no organizer ever controls or can abscond with the pooled money, and the release/refund rule executes on its own without anyone's permission or a payment processor's cooperation.

Why Blockchain Is Actually Needed: The core value is trustless conditional custody and automatic refund between people who trust each other only partially. In a normal app, either the organizer holds the money (so contributors must trust the organizer not to run off or spend it) or a company holds it (so everyone must trust — and pay — that company, and refunds depend on its policies). A Monad escrow contract removes both trust assumptions: funds sit in code nobody can unilaterally move, and the "refund everyone if we don't hit the goal" guarantee is mechanical, not a promise. Monad specifically makes this viable because dozens of small deposits and refunds cost fractions of a cent and settle in under a second, so the experience feels like Venmo, not like a slow, expensive Ethereum transaction.

MVP Scope (7 Days): Solidity escrow contract (create pot, contribute, release, auto-refund on expiry); a web app with email login + embedded wallet (Circle Wallets / Privy) and sponsored gas; USDC testnet integration via the Circle faucet; the shareable pot link and live contributor tracker. Payout-to-bank and Apple Pay on-ramp are stubbed/mocked for the demo. All shippable by one developer.

Roommate Test: It saves the organizer the ~20–30 minutes a week of sending reminders and reconciling who paid, eliminates the stress of being the group's bank, and removes the real money risk of being left holding a $1,200 charge. Contributors get certainty their money comes back if the plan dies — something Venmo can't promise.
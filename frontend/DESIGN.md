# Potluck Design System

Potluck is not a crypto product. It's a shared pot for group money that happens to run on a
chain. Every design decision serves one feeling: **calm confidence about money**. If a screen
would look at home in a trading dashboard, it's wrong here.

References we steer by: Stripe (restraint), Linear (small-type density and stillness),
Cash App (money that feels human), Notion (warmth without noise).

## Brand philosophy

- **Still by default.** Money UI must not shimmer, pulse, or drift while someone decides
  whether to send. Motion is reserved for meaningful moments (see Motion).
- **Say it like a person.** Copy is plain, direct, and never scolds. Blockchain vocabulary
  appears only where it earns its place ("wallet", "MON", "Monadscan"); "escrow contract" is
  as technical as body copy gets.
- **Every claim is checkable.** Trust elements (badges, escrow row, example pot) link to
  on-chain proof. Never ship a trust claim that can't be clicked through and verified.
- **The worst case is always "you get your money back."** UI should quietly reinforce this
  floor wherever money is requested.

## Color

Defined as role tokens in `app/globals.css` (`@theme` / `@theme inline`).

| Role | Value | Use |
|------|-------|-----|
| `canvas` | stone-50 `#fafaf9` | Page background. One step warmer than component greys — deliberate. |
| `ink` | neutral-900 | Primary text, primary buttons, dark sections. |
| `ink-secondary` | neutral-600 | Secondary text, secondary button labels. |
| `ink-muted` | neutral-400 | Captions, timestamps, placeholder-tier text. |
| `brand` | emerald-600 | **Money-action buttons only** (contribute, release, refund). |
| `brand-fill` | emerald-500 | Data marks: progress fills, live/status dots, focus ring. |
| `brand-ink` | emerald-700 | Emerald text on light backgrounds (links, statuses). |
| `brand-tint` | emerald-50 | Success/positive surface tints. |
| `warn-tint` / `warn-ink` | amber-50 / amber-700 | Refund-available states, wrong-network banner. |
| `danger` | red-600 | Genuine errors only. A user cancelling their own transaction is **neutral**, never red. |

Rules:
- Emerald means "money moving the right way." Never use it decoratively.
- Exactly four hue families ever appear: neutral, emerald, amber, red. No blue.
- Dark sections invert to white/neutral on `ink`, with `white/10` hairlines.

## Typography

Inter only. Weights: 400 body, 500 UI labels, 600 all headings, 700 logo tile only.

| Level | Classes | Where |
|-------|---------|-------|
| Display | `text-5xl sm:text-6xl lg:text-7xl` + `tracking-tight` | Landing hero only |
| Headline | `text-3xl sm:text-4xl` (trust section may step up one) | Landing section headings |
| Title | `text-2xl sm:text-3xl` via `PageHeader` | App page titles |
| Card title | `text-base font-semibold` | Card/panel headings |
| Body | `text-base` | Long-form copy |
| UI | `text-sm` | Default app text — most of the product |
| Caption | `text-xs` | Chips, footnotes, timestamps |

Rules: `tracking-tight` on Title and above. `tabular-nums` on every number that can change
(amounts, percentages, countdowns, "updated Ns ago") so polling never makes digits shimmy.

## Shape (radius)

Grammar, not taste:
- **`rounded-full` = interactive or status**: buttons, pills, chips, badges, dots.
- **`rounded-2xl` (`--radius-surface`) = surfaces**: cards, panels, banners.
- **`rounded-xl` (`--radius-control`) = controls & inner rows**: inputs, toasts, nested rows.
- `rounded-md`/`rounded-lg` only for skeleton bones and the logo tile.

## Elevation (shadow)

Exactly two levels, both tokens in `globals.css`:
- `shadow-card` (+ `shadow-card-hover` for interactive cards) — resting surfaces.
- `shadow-overlay` — floating elements (toasts).

Never use Tailwind's default `shadow-*` scale directly.

## Spacing

- Card interior: `p-6 sm:p-7` — owned by `ui/Card`, never re-typed.
- Vertical stacks: `space-y-4` action groups, `space-y-5` info groups, `space-y-6` forms.
- Landing sections breathe at `py-20`–`py-36`; app pages at `py-10 sm:py-16`.
- Button padding currently spans several recipes; the pending Button primitive (see
  Roadmap) will collapse them to `lg / md / sm`.

## Motion

Motion is an accent, not an ambience:
- **Allowed:** one-time reveal on scroll (`Reveal`, landing only), progress-bar fill on load,
  toast enter/exit, transaction-state fades, skeleton pulse, the hero pill's live dot, the
  hero preview's slow float.
- **Not allowed:** infinite attention-seeking animation near money actions, hover motion
  larger than `-translate-y-1`, anything that ignores `prefers-reduced-motion` (all Framer
  Motion usage must check `useReducedMotion`).

## Component rules

- **`ui/Card`** is the only card shell. Forms use `<Card as="form" onSubmit={…}>`. If a
  surface can't use `Card`, that's a signal to extend `Card`, not to re-type its classes.
- **`ui/icons`** is the only icon source: stroke-based, `currentColor`, `aria-hidden`, sized
  by the caller (12px inside dense pills, 16px default). Icons never carry meaning alone —
  adjacent text does.
- **`truncateAddress`** lives in `lib/format.ts`. Addresses render as `0x1234…abcd` and,
  where trust matters, link to Monadscan.
- Action cards (`ReleaseButton`, `ClaimRefundButton`) are **self-gating**: they render
  nothing unless the connected wallet can actually perform the action, mirroring the
  contract's own require conditions. Never show a button the chain would reject.
- Error copy comes from one place (`getFriendlyErrorMessage`); every contract error maps to
  a plain-language sentence. Wallet rejections use the neutral toast variant.
- Keyboard focus: global `:focus-visible` ring (emerald, 2px, offset) on buttons and links;
  inputs keep their own border+ring treatment.

## Roadmap (deliberately not done yet)

- **Button primitive** (`ui/Button`: `primary` / `money` / `secondary` / `ghost` ×
  `lg` / `md` / `sm`) and migration of ~15 hand-rolled buttons — deferred as the only
  visually risky refactor (P2).
- Component adoption of the semantic color-role utilities (today they're defined but
  components still use raw palette classes — swap during the Button migration).

# Helpix prototype

Clickable prototype of every screen in the Helpix design brief. It uses Next.js 14 (App Router), TypeScript, Tailwind, Radix primitives (shadcn/ui style), Lucide and Recharts. There is no backend. All data is fictional and lives in `data/mock.ts`.

```bash
npm install
npm run dev        # http://localhost:3000
```

Open `/` for the prototype index, which lists every screen and the nine flows.

## Where things are

| Path | What |
|---|---|
| `tailwind.config.ts` | Design tokens. The default palette, type scale and radii are **replaced**, so screens can only use brief tokens. |
| `app/design-system` | DS page: tokens, type, spacing, every core component and its states |
| `components/ui/*` | Button, inputs, Combobox, DatePicker, Tabs, Segmented, Chip, Badge, StatusPill, KPI card, DataTable, charts, AI draft block, Safety alert, Stepper, Timeline, Dropzone, recording indicator, Dialog, Sheet, Toast, Skeleton, Banner, Empty state |
| `components/shell/*` | Desktop app shell (collapsible sidebar + top bar), patient 390×844 frame with the Bangla/English toggle, WhatsApp frame, prototype bar |
| `app/m/*` | M1–M10 Management |
| `app/d/*` | D1–D7 Doctor |
| `app/f/*` | F1–F5 Front desk |
| `app/p/*`, `app/w/*` | P1–P13 Patient, W1–W3 WhatsApp |
| `app/o/*` | O1–O3 Auth and onboarding |
| `lib/screens.ts` | Screen registry and flow definitions |

## Prototype conventions

- `?state=loading|empty|error|offline` works on M1, D1, D5 and F1. The floating prototype bar (bottom-left) switches it and shows the **Next** screen in every flow.
- Patient screens are Bangla by default. Add `?lang=en` or use the toggle in the header. Digits switch to Bangla numerals too.
- `?state=empty` on M7 shows the locked "Benchmark unlocks when 3 or more hospitals are live" variant.
- D6 has two variants: `/d/reviews/rahima` (in-house lab) and `/d/reviews/mizanur` (outside upload with AI-extracted values).

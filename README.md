# Vow

**An event platform** — beautiful enough for a 20-guest civil ceremony, architected to run any future event without code changes. The first event: Michael & Dina, 18 September 2026, Ulm/Neu-Ulm.

React 19 · TypeScript (strict) · Vite · Tailwind v4 · motion (Framer Motion) · React Router (hash) · TanStack Query · React Hook Form + Zod · Lucide · Firebase (Firestore/Storage/Auth/Functions) · GitHub Pages.

Two themes mapped to the day itself: **Morning Garden** (light, default) and **Candlelit Evening** (dark). EN default, DE toggle. Design rationale: [DESIGN.md](DESIGN.md) · product: [PRODUCT.md](PRODUCT.md) · data model: [docs/SCHEMA.md](docs/SCHEMA.md).

## Status — honest ledger (Phase 1 of 4)

| Area | State |
|---|---|
| Design system: Tailwind tokens, both themes, visible glass-over-wash, skeletons | ✅ P1 |
| Landing: floating medallion slot, script mark, animated countdown, welcome, View Event | ✅ P1 |
| Guest identify (email/phone → local session) + personalized schedule (roles/guests) | ✅ P1 |
| Schedule cards: times, location, notes, Google/Apple/OSM links, visibility badges | ✅ P1 |
| RSVP: yes/no/maybe, dietary chips, allergies, message, contact, edit-until-deadline, confetti | ✅ P1 |
| Plus-one requests (guest side) | ✅ P1 |
| Motion: page transitions, staggered reveals, rolling countdown digits, hover/tap, reduced-motion | ✅ P1 |
| i18n EN/DE (chrome) + LocalizedText (content) | ✅ P1 — DE proofread pending |
| Data layer: `DataSource` seam, seed demo event, Firestore impl + Zod parsing | ✅ P1 — Firestore impl **not yet exercised** (no project) |
| Couple illustration | 🟡 slot + float built — art extracted from the couple's Canva in P2 |
| Hotels, weather, gallery, messages, live event mode, calendar, contact/parking/emergency, PWA | ⏳ P2 |
| Admin CMS (all editors, dashboards, reminders, plus-one approvals, theme settings) | ⏳ P3 |
| Photos → Firebase Storage → Cloud Function → OneDrive | ⏳ P4 (needs Blaze + Azure app) |
| `firestore.rules` | 🟡 draft, deny-by-default for guest data — hardened in P3 (see SCHEMA.md) |
| Deploy | ⏸ manual `workflow_dispatch` after the couple's audit |

**Content is placeholder by design** — the demo event (`event.placeholder: true`) shows a visible ribbon; the couple's real schedule/venues/texts are entered in the Admin CMS once confirmed. Nothing event-specific is hardcoded.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4974
```

No setup needed — without Firebase env the app runs on the built-in seed event.
Demo guests for identify: `demo@vow.app` (Guest) · `witness@vow.app` (Witness — sees a role-gated schedule item).
Debug: append `?noanim=1` to render all motion settled (used for headless screenshots).

## Connect Firebase (owner setup, ~10 min)

1. [console.firebase.google.com](https://console.firebase.google.com) → create project, region **europe-west3 (Frankfurt)**.
2. Add a **Web App** → copy config into `.env.local` per [.env.example](.env.example).
3. Firestore: create database (production mode) → paste `firestore.rules` → seed the first event per [docs/SCHEMA.md](docs/SCHEMA.md).
4. Restart dev server — the app switches from seed to Firestore automatically.

Phase 4 additionally needs the **Blaze plan** (Cloud Functions) and an **Azure app registration** (Microsoft Graph → OneDrive sync).

## Architecture

```mermaid
flowchart LR
  QR[Invite / QR] --> Site[SPA · GitHub Pages · HashRouter]
  Site -- TanStack Query --> DS{DataSource}
  DS -- no env --> Seed[(Seed demo event\nlocalStorage writes)]
  DS -- VITE_FIREBASE_* --> FS[(Firestore + Rules)]
  Site -- P4 upload --> ST[(Firebase Storage)]
  ST -- P4 Cloud Function --> OD[(OneDrive · Graph API)]
  Admin[/#/admin · Firebase Auth · P3/] --> FS
```

Folder structure: `src/{app, pages, features/<domain>, components/ui, hooks, services/{data,firebase}, types, lib, animations, i18n, styles}`.

## Launch checklist

- [ ] Couple confirms real schedule/venues/texts → entered via Admin CMS (P3)
- [ ] Couple illustrations extracted from their Canva → `heroIllustrationUrl` (P2)
- [ ] German copy proofread by the couple (`src/i18n/de.ts` + content)
- [ ] Firebase project created & rules hardened; seed→Firestore switch verified
- [ ] Real-device pass (iOS Safari + Android) — pane verification can't cover feel
- [ ] Lighthouse ≥95 audit (P3 gate)
- [ ] Custom domain → workflow `base` = `/`
- [ ] Run **Deploy to Pages** from the Actions tab

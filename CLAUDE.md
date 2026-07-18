# Vow — project conventions

**This is an event platform, not a wedding website.** The wedding is event #1. Nothing event-specific is hardcoded — all content lives in the data layer (Firestore later, seed now) and is edited in the Admin CMS (Phase 3). If you find yourself typing a venue, time, or guest name into a component: stop, it belongs in data.

- **Stack:** Vite + React 19 + strict TS + Tailwind v4 (tokens in `src/styles/app.css` `@theme`) + motion (`motion/react`) + HashRouter + TanStack Query + RHF/Zod + lucide. Firebase via `VITE_FIREBASE_*` env (`.env.example`); without env the seed source runs. GitHub Pages compatible always.
- **Data seam:** UI imports only `data` from `src/services/data` (`DataSource` interface). Zod schemas in `src/types/index.ts` are the canonical model — parse at the boundary, never trust raw docs.
- **Content localization:** guest-facing content strings are `LocalizedText {en,de}` in data; UI chrome strings live in `src/i18n/{en,de}.ts` (key-identical, `de` typed as `Dict`). German is du/ihr-Form and proofread by the couple before launch.
- **Privacy:** public repo ⇒ no real guest data, personal phone numbers, or booking codes anywhere in git. Seed data is fictional/demo-flagged (`event.placeholder`). Real content enters via CMS/Firestore only.
- **Glass:** only over a `wash-garden` (or imagery) — glass over flat ivory reads grey. Recipe lives in `app.css` (`glass`, `glass-strong`, saturate 1.8). Don't stack dozens of live blurs in one viewport.
- **Motion:** variants/helpers in `src/animations/` only; every loop guards `useReducedMotion`; entrances use `reveal()`/`entrance()` which honor `ANIM_OFF`.
- **Verification in the Claude Code Browser pane:** the pane never fires rAF and randomly ghost-navigates. Always verify with `?noanim=1` (sets `ANIM_OFF` → `initial:false`, AnimatePresence bypassed), drive flows in ONE atomic `javascript_exec` with polling, use `location.hash` for routing, `scrollTo({behavior:"instant"})`. Never infer performance from pane behavior.
- **Deploy:** manual `workflow_dispatch` only, after the couple's audit. Never add push-triggered deploys.
- **Docs:** Firestore layout in `docs/SCHEMA.md`; draft `firestore.rules` is NOT hardened — revisit before any real guest data (identify-flow tension documented in SCHEMA.md).

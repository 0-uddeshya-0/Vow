# Vow — project conventions

- **Privacy is structural.** Never commit: personal phone numbers, the hotel booking code, guest names/tokens, or anything from Supabase. Those flow through `site_content` + token-gated RPCs. `content.local.json` is gitignored dev-only.
- **Config-driven.** Structured wedding data only in `src/config/wedding.ts`; ALL copy in `src/i18n/{en,de}.ts` (keep the two dictionaries key-identical — `de` is typed as `Dict` of `en`). No hardcoded strings in components.
- **German copy** is du/ihr-Form and must be proofread by the couple before deploy (README launch checklist).
- **Fonts are self-hosted** (@fontsource) for GDPR — never add a font/CDN request.
- **Glass budget: 4 backdrop-filter surfaces max** (topbar, gate, RSVP, photos). Chips/lists stay flat. See DESIGN.md "Materials".
- **Motion rules:** entrances via `src/motion/motion.ts` only (registry enables `revealAll()`); content authored visible; `motionOK()` guard everywhere; ease-out only.
- **Verification:** the Claude Code Browser pane never paints rAF — GSAP states stay initial and `computer scroll` times out. Verify via `window.__vowRevealAll()` (dev) + JS `scrollTo` + screenshots. Never infer performance from pane timeouts.
- **Deploy is manual** (`workflow_dispatch`) after the couple's audit — do not add push-triggered deploys.
- Character layer: `data-scene` mounts in `Timeline.tsx` are reserved for the future animated Michael & Dina figures — don't remove them.

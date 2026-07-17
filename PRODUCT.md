# Vow — Michael & Dina's Wedding Website

## What this is

A single-page, mobile-first wedding website for **Michael & Dina**, marrying **Friday 18 September 2026** in Ulm / Neu-Ulm, Germany. Invitation reaches guests as a paper flyer with a QR code that resolves to this site. ~20 guests, all German-based, invite-only.

**Register:** brand — the design IS the product. The site is a keepsake and an act of hospitality, not a SaaS tool.

## Users

- **Guests (~20).** 95% on phones, roughly 50/50 iPhone/Android. Three guests over 60 (two with phones; one phone-less guest is RSVP'd by proxy). They need: the schedule, the addresses, hotels, taxi, RSVP — fast, warm, legible.
- **The couple.** The site speaks in their first-person voice ("we"). They review everything before deploy.
- **The admin (repo owner).** Manages the guest list, chases RSVPs via precomposed WhatsApp/mail links, edits menu/info content, exports dietary data.

## The one thing that must not fail

Guests RSVP by **30 August 2026** with dietary needs collected accurately (free-text allergies + preference chips). Everything else is decoration.

## Feature spine

1. Hero: names, date, place, RSVP call — above the fold, no scrolling required for the basics.
2. Schedule timeline: six moments from Standesamt (11:30) to dinner's end (22:00), each with venue + map link.
3. Stay: four recommended hotels, rooms held until 30.08, phone booking with a code (code injected at runtime, never in repo).
4. Getting around: taxi contacts, maps.
5. Kind requests: presence over phones, easy on the glitter, invited guests only, no drugs. Emergency contact at runtime.
6. FAQ: dress code (formal), no children, RSVP editing.
7. RSVP: per-individual, optional self-added +1, dietary chips + free-text allergies, message to the couple. Gated by per-guest magic link.
8. Photo gallery (post-event): gated browser upload → Supabase Storage → synced to the couple's OneDrive. No accounts, no app.
9. Character layer (deferred): mini animated Michael & Dina accompanying the scroll story. Decision pending — remind at site completion.

## Architecture constraints

- **Static site (GitHub Pages)** + **Supabase** (Postgres/Auth/Storage) from the browser. No server of our own.
- **Config-driven and reusable**: all wedding data in one typed config; swap data, reuse site.
- **Bilingual**: English default, German toggle. German copy proofed by Michael & Dina before launch.
- **Two first-class themes**: light "Morning Garden" (default) and dark "Candlelit Evening" — mapped to the day's arc, not a mechanical inversion.
- **Privacy**: no personal data in the public repo (emergency phone, booking code live in Supabase `site_content`; guest data in RLS-protected tables). Gallery and RSVP behind the guest gate.
- **GDPR**: fonts self-hosted (no Google Fonts CDN), no third-party trackers, no analytics.
- **Performance budget**: glass surfaces are rationed (hero + gate + one panel tier); one animated canvas maximum; reduced-motion honoured everywhere.

## Source of visual truth

The couple's Canva flyer ("Dina x Michael", DAHPq7P_hHE): ivory ground, watercolour white roses + eucalyptus, thin antique-gold frame, black calligraphic script ("Wir heiraten"), letter-spaced serif caps. The site reinterprets this — it does not clone it, and does not reuse Canva-licensed raster assets (original line-art botanicals instead).

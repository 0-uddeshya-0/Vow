# Vow — Design System

Identity derives from the couple's flyer: ivory, botanical, antique gold, calligraphy. The two themes are the two halves of the wedding day itself.

## Scene sentences (why each theme looks the way it does)

- **Light — "Morning Garden" (default).** A guest opens the link in daylight over breakfast: an 11:30 civil ceremony, white roses, September sun through conservatory glass. Frosted-white panels, gold hairlines, sage stems.
- **Dark — "Candlelit Evening."** The same guest checks the dinner address at 21:40 from the Henrichs terrace by the Danube: candlelight, deep green-black, warm gold. Glass gets deeper and richer here; this is where refraction belongs.

## Color tokens (OKLCH; hex fallbacks in tokens.css)

### Light — Morning Garden
| Token | OKLCH | ≈Hex | Role |
|---|---|---|---|
| `--bg` | 0.965 0.010 95 | `#F7F3EA` | ivory ground (flyer's own) |
| `--surface` | white @ 55% + blur | — | frosted panel |
| `--ink` | 0.28 0.020 80 | `#332C20` | headings, body |
| `--ink-soft` | 0.42 0.025 95 | `#5C5442` | secondary text (AA on bg) |
| `--sage` | 0.58 0.055 130 | `#6F8159` | botanical, accents |
| `--sage-deep` | 0.43 0.055 135 | `#485B3B` | sage text (AA) |
| `--gold` | 0.68 0.095 85 | `#BB9254` | hairlines, ornaments (decorative) |
| `--gold-ink` | 0.50 0.090 80 | `#84632F` | gold as text (AA-large) |

### Dark — Candlelit Evening
| Token | OKLCH | ≈Hex | Role |
|---|---|---|---|
| `--bg` | 0.185 0.015 140 | `#141A11` | green-black night |
| `--surface` | `#1E2618` @ 60% + blur | — | deep glass |
| `--ink` | 0.93 0.012 90 | `#EDE8DB` | warm chalk |
| `--ink-soft` | 0.74 0.020 100 | `#B0AB97` | secondary |
| `--sage` | 0.76 0.055 130 | `#A9BC92` | lifted sage |
| `--sage-deep` | 0.83 0.045 130 | `#C2D2AE` | sage text on dark |
| `--gold` | 0.78 0.095 85 | `#D9B475` | candle gold |
| `--gold-ink` | 0.80 0.090 85 | `#DFBC7E` | gold as text on dark |

Semantic: `--ok` sage-derived, `--err` oklch(0.55 0.12 30) muted brick — never the accent.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display | **Cormorant Garamond** 500/600 (+italic) | flyer's high-contrast serif energy; `text-wrap: balance`; letter-spacing ≥ −0.02em |
| Script | **Pinyon Script** 400 | copperplate, ONLY for: "Wir heiraten" mark, the ampersand, one signature. Never body. |
| Body/UI | **Jost** variable | German Futura revival — Paul Renner lineage fits Ulm; `font-variant-numeric: tabular-nums` for times |

All self-hosted via @fontsource (GDPR). Body 17px min, 1.65 line-height, 65ch measure. The "Wir heiraten" script line stays German in both languages — it is the couple's mark, with a localized subline.

## Materials

- **Glass budget (hard rule):** light theme = frost (blur 12–16px, saturate 1.3, white 50–60%, gold hairline border); dark theme = deep glass (blur 16px, green-black 60%). Max ~4 live backdrop-filter surfaces per viewport. Chips, lists, footers: flat tints, no filters.
- **Refraction lens** (SVG displacement in backdrop-filter): dark-theme hero only, Chromium only, frost fallback. Never on scrolling content.
- **Gold hairlines**: 1px, flyer's frame language — section rules, panel borders, the timeline thread.
- **Botanicals**: original single-stroke line-art sprigs (eucalyptus/rose hints) in sage/gold, drawn on by stroke animation. No watercolour rasters (Canva license + kitsch risk).

## Motion (GSAP + ScrollTrigger)

- **Principle: the page is a garden unfurling, not a slideshow.** Motion draws lines and lets content breathe; it never blocks reading.
- Load: hero sprig draws in (~1.1s stroke), names rise softly, script mark last.
- Scroll: the **gold thread** of the timeline draws with scrub (stroke-dashoffset); each moment's content is visible by default and *enhanced* (6–14px rise + fade) — never hidden until triggered.
- Micro: 150–250ms, ease-out-quart/expo only. No bounce, no elastic.
- Reduced motion: all scrub/draw effects become static-final; reveals become instant. `gsap.matchMedia`.
- Character layer mounts (`data-scene`) reserved at each timeline moment for the future Michael & Dina figures.

## Layout

Single column, `min(100% − 2.5rem, 42rem)` on mobile → 52rem desktop. Sections separated by gold hairline + diamond glyph, generous unequal spacing (rhythm, not uniform). Sticky top bar: monogram, language pill, theme toggle — frost, one of the budgeted glass surfaces.

## Voice

First-person plural, warm, unhurried, du-Form in German. Buttons say what happens ("Send our RSVP", "Save the date to your calendar"). No exclamation-mark inflation.

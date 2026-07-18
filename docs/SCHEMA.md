# Vow — Firestore schema

Multi-event platform: **everything lives under `events/{eventId}`**. Adding an
event = one new document tree, created in the Admin CMS. Nothing in the code
is hardcoded to a specific wedding. All documents are validated through the
Zod schemas in `src/types/index.ts` — that file is the canonical, typed
definition of every field below.

```
events/{eventId}                     zEvent          slug, coupleNames, mark, date, timezone,
                                                     welcome/intro (LocalizedText), rsvpDeadline,
                                                     heroIllustrationUrl, theme, placeholder
  guests/{guestId}                   zGuest          fullName, email, phone, roles[], language,
                                                     invitationStatus, reminderCount, lastReminderAt
  schedule/{itemId}                  zScheduleItem   order, title/description (LocalizedText),
                                                     imageUrl, date, start, end, location{...maps},
                                                     notes, visibility{allowedRoles, allowedGuests}
  hotels/{hotelId}                   zHotel          order, name, description, images[], recommended,
                                                     websiteUrl, bookingUrl, phone, priceCategory,
                                                     walking/drivingMinutes, location
  faq/{faqId}                        zFaqItem        order, question, answer
  gallery/{imageId}                  zGalleryImage   order, url, caption
  messages/{messageId}               zMessage        createdAt, title, body, visibility
  rsvps/{guestId}                    zRsvp           attending yes|no|maybe, dietary[], allergies,
                                                     message, phone, email, updatedAt
  plusOneRequests/{requestId}        zPlusOneRequest guestId, fullName, email|phone, status
  settings/settings                  zSettings       contact[], emergency[], footerText
  weatherSettings/settings           zWeatherSettings enabled, daysBefore, lat, lng
  photos/{photoId}                   (Phase 4)       guest uploads → Storage → OneDrive sync
```

## Conventions

- **LocalizedText** = `{ en, de }` — every guest-facing content string. UI
  chrome lives in `src/i18n`; content lives here and is edited in the CMS.
- **Visibility** = `{ allowedRoles: [], allowedGuests: [] }`; empty arrays =
  public. Filtering happens client-side via `visibleTo()` (and later
  server-side for private collections).
- **Roles are arbitrary strings** (Guest, Family, Witness, Bride, …) —
  defined per event in the CMS, never enumerated in code.
- Times are `"HH:MM"` in the event's IANA `timezone`; dates are `YYYY-MM-DD`.

## Identify-flow security (open item, resolved in P2/P3)

Guests identify by email/phone without accounts. Firestore rules cannot
constrain an unauthenticated query by its where-clause, so a naive
`allow read` on `guests` would make the guest list publicly enumerable —
unacceptable. Plan: at identify time the app signs in with **Firebase
Anonymous Auth**, then a lookup (Cloud Function in P4, or a narrow
custom-claims flow) resolves contact → guestId and stamps the session.
Until then `guests`/`rsvps` stay admin-only in `firestore.rules`, and the
seed data source (no Firebase) powers development.

## Data sources

`src/services/data/index.ts` picks the backend at startup:
- **seed** (`seed.ts`) — built-in demo event, `placeholder: true`, guest
  writes persist to localStorage. Active whenever Firebase env is absent.
- **firebase** (`firebase.ts`) — Firestore implementation of the same
  `DataSource` interface. Activated by `VITE_FIREBASE_*` (see `.env.example`).
  Compiled and type-checked; not yet exercised against a live project.

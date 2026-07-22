# Push notifications (free tier)

Day-of push for guests, with **no paid Cloud Functions**. Guests opt in from
their event page; the couple broadcasts from their own machine with a tiny
script. FCM message delivery is free — only *automated* sending (Cloud
Functions) needs the Blaze plan, which we don't use.

## How it works

1. **Opt-in (guest):** on the event page, an identified guest taps *Enable
   notifications*. The browser asks permission, mints an FCM device token, and
   stores it at `events/{eventId}/pushTokens/{token}`.
2. **Background delivery:** `public/firebase-messaging-sw.js` shows the
   notification even when the tab is closed. Foreground messages are shown by
   `src/services/firebase/messaging.ts`.
3. **Broadcast (couple):** run the local script; it reads every opted-in token
   and sends via the Firebase Admin SDK.

## One-time setup

- **VAPID key** (already wired): Console → Project settings → Cloud Messaging →
  *Web Push certificates*. It lives in `.env.local` and the deploy workflow as
  `VITE_FIREBASE_VAPID_KEY`. Public by design.
- **Service account** (for sending): Console → Project settings → Service
  accounts → *Generate new private key*. Save it as
  `scripts/service-account.json` (git-ignored — never commit it).
- `npm install firebase-admin`.

## Sending a broadcast

```bash
node scripts/send-push.mjs "Ceremony starting" "Please take your seats 💍"
```

The script reports delivery counts and prunes tokens for devices that
uninstalled. Check the current subscriber count in the admin **Notify** tab.

## Notes / limits

- iOS Safari only supports web push when the site is **installed to the home
  screen** (Add to Home Screen), per Apple. Android/desktop Chrome & Firefox
  work in-browser.
- Tokens are opaque; no personal data beyond the guest's name is stored.

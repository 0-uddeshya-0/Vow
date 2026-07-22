#!/usr/bin/env node
/**
 * Broadcast a push notification to every guest who opted in — free, no Cloud
 * Functions (FCM send via the Admin SDK is free; only Functions need Blaze).
 *
 * Setup (one time):
 *   1. Firebase Console → Project settings → Service accounts →
 *      "Generate new private key". Save it as scripts/service-account.json
 *      (already git-ignored).
 *   2. npm install firebase-admin
 *
 * Usage:
 *   node scripts/send-push.mjs "Title" "Body text"
 *   node scripts/send-push.mjs "Ceremony starting" "Please take your seats 💍"
 *
 * Optional: pass an event id as the 3rd arg (defaults to the active event).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_EVENT_ID = "demo-wedding"; // the active event's doc id

const [, , title, body = "", eventArg] = process.argv;
if (!title) {
  console.error('Usage: node scripts/send-push.mjs "Title" "Body" [eventId]');
  process.exit(1);
}
const eventId = eventArg || DEFAULT_EVENT_ID;

let admin;
try {
  admin = await import("firebase-admin");
} catch {
  console.error("firebase-admin is not installed. Run: npm install firebase-admin");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(join(__dirname, "service-account.json"), "utf8"));
} catch {
  console.error(
    "Missing scripts/service-account.json — download it from Firebase Console → " +
      "Project settings → Service accounts → Generate new private key.",
  );
  process.exit(1);
}

const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore(app);
const messaging = admin.messaging(app);

const snap = await db.collection("events").doc(eventId).collection("pushTokens").get();
const tokens = snap.docs.map((d) => d.data().token).filter((t) => typeof t === "string" && t.length);

if (!tokens.length) {
  console.log(`No subscribers for event "${eventId}". Nobody has opted in yet.`);
  process.exit(0);
}

console.log(`Sending "${title}" to ${tokens.length} device(s)…`);

// sendEachForMulticast handles up to 500 tokens per call.
let sent = 0;
const stale = [];
for (let i = 0; i < tokens.length; i += 500) {
  const batch = tokens.slice(i, i + 500);
  const res = await messaging.sendEachForMulticast({
    tokens: batch,
    notification: { title, body },
  });
  sent += res.successCount;
  res.responses.forEach((r, j) => {
    if (
      !r.success &&
      ["messaging/registration-token-not-registered", "messaging/invalid-argument"].includes(
        r.error?.code,
      )
    ) {
      stale.push(batch[j]);
    }
  });
}

console.log(`Delivered to ${sent}/${tokens.length}.`);

// Clean up tokens for devices that unsubscribed / uninstalled.
if (stale.length) {
  await Promise.all(
    stale.map((tok) =>
      db.collection("events").doc(eventId).collection("pushTokens").doc(tok).delete(),
    ),
  );
  console.log(`Removed ${stale.length} stale token(s).`);
}

process.exit(0);

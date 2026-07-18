/**
 * Vow · Cloud Functions — OneDrive photo sync (Phase 4).
 *
 * Pipeline: guest upload → Storage finalize trigger → upload to the couple's
 * OneDrive via Microsoft Graph → mark the Firestore photo doc `synced`.
 * A scheduled sweep retries anything that failed (venue wifi, Graph hiccups)
 * with capped attempts, so a failed sync self-heals without intervention.
 *
 * REQUIREMENTS (why this directory is not yet deployed — documented, not hidden):
 *  - Firebase Blaze plan (functions don't run on Spark)
 *  - Azure app registration + a one-time delegated consent to obtain the
 *    refresh token — full walkthrough in docs/ONEDRIVE.md
 *  - Secrets: firebase functions:secrets:set MS_CLIENT_ID MS_CLIENT_SECRET MS_REFRESH_TOKEN
 */
import { setGlobalOptions } from "firebase-functions/v2";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/v2/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions";

initializeApp();
setGlobalOptions({ region: "europe-west3", maxInstances: 3 });

const MS_CLIENT_ID = defineSecret("MS_CLIENT_ID");
const MS_CLIENT_SECRET = defineSecret("MS_CLIENT_SECRET");
const MS_REFRESH_TOKEN = defineSecret("MS_REFRESH_TOKEN");

const MAX_ATTEMPTS = 5;

/** Personal-account OneDrive uses the `consumers` tenant. */
async function graphToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id: MS_CLIENT_ID.value(),
    client_secret: MS_CLIENT_SECRET.value(),
    refresh_token: MS_REFRESH_TOKEN.value(),
    grant_type: "refresh_token",
    scope: "https://graph.microsoft.com/Files.ReadWrite offline_access",
  });
  const res = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/** ≤4MB per Graph simple upload; our compressed photos are ~400KB. */
async function uploadToOneDrive(eventId: string, name: string, bytes: Buffer): Promise<void> {
  const token = await graphToken();
  const path = encodeURIComponent(`Vow/${eventId}/${name}`);
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/content`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/jpeg" },
      body: new Uint8Array(bytes),
    },
  );
  if (!res.ok) throw new Error(`graph ${res.status}: ${await res.text()}`);
}

async function syncOne(eventId: string, photoId: string, storagePath: string): Promise<void> {
  const [bytes] = await getStorage().bucket().file(storagePath).download();
  await uploadToOneDrive(eventId, `${photoId}.jpg`, bytes);
  await getFirestore().doc(`events/${eventId}/photos/${photoId}`).set(
    { status: "synced", syncError: "", syncAttempts: 0 },
    { merge: true },
  );
  logger.info(`synced ${storagePath}`);
}

export const onPhotoUploaded = onObjectFinalized(
  { secrets: [MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REFRESH_TOKEN] },
  async (event) => {
    const m = /^events\/([^/]+)\/photos\/([^/]+)\.jpg$/.exec(event.data.name ?? "");
    if (!m) return;
    const [, eventId, photoId] = m;
    try {
      await syncOne(eventId, photoId, event.data.name);
    } catch (err) {
      logger.error(`sync failed for ${event.data.name}`, err);
      await getFirestore().doc(`events/${eventId}/photos/${photoId}`).set(
        { syncError: String(err), syncAttempts: 1 },
        { merge: true },
      );
      // The scheduled sweep below retries; do not throw (avoids hot retry loops).
    }
  },
);

export const retryFailedSyncs = onSchedule(
  { schedule: "every 30 minutes", secrets: [MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REFRESH_TOKEN] },
  async () => {
    const snap = await getFirestore()
      .collectionGroup("photos")
      .where("syncAttempts", ">", 0)
      .where("syncAttempts", "<", MAX_ATTEMPTS)
      .limit(20)
      .get();
    for (const doc of snap.docs) {
      const d = doc.data() as { eventId: string; storagePath: string; syncAttempts: number };
      try {
        await syncOne(d.eventId, doc.id, d.storagePath);
      } catch (err) {
        await doc.ref.set(
          { syncError: String(err), syncAttempts: d.syncAttempts + 1 },
          { merge: true },
        );
        if (d.syncAttempts + 1 >= MAX_ATTEMPTS) {
          logger.error(`giving up on ${d.storagePath} after ${MAX_ATTEMPTS} attempts`);
        }
      }
    }
  },
);

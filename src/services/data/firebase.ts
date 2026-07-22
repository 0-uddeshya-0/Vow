import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { contactHash } from "../../lib/contact";
import { z } from "zod";
import {
  zEvent,
  zFaqItem,
  zGalleryImage,
  zGuest,
  zHotel,
  zMessage,
  zPhoto,
  zPlusOneRequest,
  zRsvp,
  zScheduleItem,
  zSettings,
  zWeatherSettings,
  type Photo,
} from "../../types";
import { getDb } from "../firebase/app";
import type { DataSource } from "./types";

/**
 * Firestore data source. Layout (documented in docs/SCHEMA.md):
 *   events/{eventId}
 *   events/{eventId}/guests/{guestId}
 *   events/{eventId}/schedule/{itemId}     … hotels, faq, gallery, messages
 *   events/{eventId}/rsvps/{guestId}
 *   events/{eventId}/plusOneRequests/{id}
 *   events/{eventId}/settings/settings
 * Every doc is parsed through Zod — malformed CMS data fails loudly here,
 * not silently in the UI.
 *
 * NOTE: compiled + type-checked, but NOT yet exercised against a live
 * project/emulator (none exists yet). The seed source is the verified path.
 */

function parseAll<T>(schema: z.ZodType<T>, snaps: { id: string; data: () => unknown }[]): T[] {
  return snaps.map((s) => schema.parse({ ...(s.data() as object), id: s.id }));
}

/**
 * Tolerant variant: drop (and warn about) documents that fail validation
 * instead of throwing the whole batch away. Used for guest-generated
 * collections (photos) where a single partially-written or legacy doc must
 * never blank the entire admin list — the exact bug that hid *all* uploads
 * from the review panel because one orphan doc had no url/guestId/createdAt.
 * CMS-owned content still uses the strict `parseAll` so real schema drift
 * fails loudly.
 */
function parseAllSafe<T>(
  schema: z.ZodType<T>,
  snaps: { id: string; data: () => unknown }[],
  extend: (raw: Record<string, unknown>, id: string) => Record<string, unknown> = (raw, id) => ({
    ...raw,
    id,
  }),
): T[] {
  const out: T[] = [];
  for (const s of snaps) {
    const parsed = schema.safeParse(extend(s.data() as Record<string, unknown>, s.id));
    if (parsed.success) out.push(parsed.data);
    else console.warn(`[vow] skipping malformed doc ${s.id}:`, parsed.error.issues);
  }
  return out;
}

const sub = (eventId: string, name: string) => collection(getDb(), "events", eventId, name);

export const firebaseDataSource: DataSource = {
  kind: "firebase",

  async getEventBySlug(slug) {
    const snap = await getDocs(
      query(collection(getDb(), "events"), where("slug", "==", slug), limit(1)),
    );
    const d = snap.docs[0];
    return d ? zEvent.parse({ ...d.data(), id: d.id }) : null;
  },

  /**
   * Identify without an account: hash the contact, `get` (never `list`) the
   * lookup doc, then `get` the guest by its unguessable id. See
   * src/lib/contact.ts for why this is the shape it is.
   */
  async findGuest(eventId, contact) {
    const hash = await contactHash(contact);
    const lookup = await getDoc(doc(getDb(), "events", eventId, "guestLookup", hash));
    if (!lookup.exists()) return null;
    const guestId = (lookup.data() as { guestId?: string }).guestId;
    if (!guestId) return null;
    const d = await getDoc(doc(getDb(), "events", eventId, "guests", guestId));
    return d.exists() ? zGuest.parse({ ...d.data(), id: d.id, eventId }) : null;
  },

  async getGuest(eventId, guestId) {
    const d = await getDoc(doc(getDb(), "events", eventId, "guests", guestId));
    return d.exists() ? zGuest.parse({ ...d.data(), id: d.id, eventId }) : null;
  },

  async listSchedule(eventId) {
    const snap = await getDocs(query(sub(eventId, "schedule"), orderBy("order")));
    return parseAll(zScheduleItem, snap.docs).map((s) => ({ ...s, eventId }));
  },

  async listHotels(eventId) {
    const snap = await getDocs(query(sub(eventId, "hotels"), orderBy("order")));
    return parseAll(zHotel, snap.docs).map((h) => ({ ...h, eventId }));
  },

  async listFaq(eventId) {
    const snap = await getDocs(query(sub(eventId, "faq"), orderBy("order")));
    return parseAll(zFaqItem, snap.docs).map((f) => ({ ...f, eventId }));
  },

  async listGallery(eventId) {
    const snap = await getDocs(query(sub(eventId, "gallery"), orderBy("order")));
    return parseAll(zGalleryImage, snap.docs).map((g) => ({ ...g, eventId }));
  },

  async listMessages(eventId) {
    const snap = await getDocs(query(sub(eventId, "messages"), orderBy("createdAt", "desc")));
    return parseAll(zMessage, snap.docs).map((m) => ({ ...m, eventId }));
  },

  async getSettings(eventId) {
    const d = await getDoc(doc(getDb(), "events", eventId, "settings", "settings"));
    return d.exists() ? zSettings.parse({ ...d.data(), eventId }) : null;
  },

  async getWeatherSettings(eventId) {
    const d = await getDoc(doc(getDb(), "events", eventId, "weatherSettings", "settings"));
    return d.exists() ? zWeatherSettings.parse({ ...d.data(), eventId }) : null;
  },

  async getRsvp(eventId, guestId) {
    const d = await getDoc(doc(getDb(), "events", eventId, "rsvps", guestId));
    return d.exists() ? zRsvp.parse({ ...d.data(), eventId, guestId }) : null;
  },

  async saveRsvp(rsvp) {
    await setDoc(doc(getDb(), "events", rsvp.eventId, "rsvps", rsvp.guestId), rsvp);
  },

  /**
   * Nested under the requesting guest: the path itself scopes access, so a
   * guest can read their own requests without `list` on a shared collection
   * (which would expose every proposed plus-one's contact details).
   */
  async createPlusOneRequest(req) {
    await setDoc(
      doc(getDb(), "events", req.eventId, "guests", req.guestId, "plusOneRequests", req.id),
      req,
    );
  },

  async listPlusOneRequests(eventId, guestId) {
    const snap = await getDocs(
      collection(getDb(), "events", eventId, "guests", guestId, "plusOneRequests"),
    );
    return parseAll(zPlusOneRequest, snap.docs).map((r) => ({ ...r, eventId }));
  },

  /**
   * NO Firebase Storage. Firebase Storage requires the paid Blaze plan, so
   * the photo is compressed under the 1MB Firestore-document limit and stored
   * as a data URL directly in the photo doc. This works on the free plan and
   * makes uploads appear in the admin review tab immediately (they are just
   * documents). `storagePath` stays empty. (A future OneDrive sync would read
   * the data URL from Firestore instead of a Storage object.)
   */
  async uploadPhoto(eventId, guest, blob, onProgress) {
    onProgress(0.2);
    const { ensureUnder, blobToDataUrl } = await import("../../lib/image");
    const small = await ensureUnder(blob);
    onProgress(0.6);
    const url = await blobToDataUrl(small);
    onProgress(0.85);
    const id = `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const photo: Photo = {
      id,
      eventId,
      guestId: guest.id,
      guestName: guest.fullName,
      storagePath: "",
      url,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(getDb(), "events", eventId, "photos", id), photo);
    onProgress(1);
    return photo;
  },

  async listMyPhotos(eventId, guestId) {
    const snap = await getDocs(
      query(sub(eventId, "photos"), where("guestId", "==", guestId)),
    );
    return parseAllSafe(zPhoto, snap.docs, (raw, id) => ({ ...raw, id, eventId }));
  },

  /* ——— admin (security enforced by firestore.rules, not by this file) ——— */

  async adminListGuests(eventId) {
    const snap = await getDocs(sub(eventId, "guests"));
    return parseAll(zGuest, snap.docs).map((g) => ({ ...g, eventId }));
  },
  /**
   * Saving a guest also rewrites their lookup documents (one per contact
   * method) and clears stale ones, so changing an email can never leave a
   * dangling key that still resolves to this guest.
   */
  async adminSaveGuest(guest) {
    const db = getDb();
    const path = (h: string) => doc(db, "events", guest.eventId, "guestLookup", h);
    // Read-for-cleanup and the write itself are independent, so they go out
    // together rather than costing two sequential round trips.
    const [previous] = await Promise.all([
      getDoc(doc(db, "events", guest.eventId, "guests", guest.id)),
      setDoc(doc(db, "events", guest.eventId, "guests", guest.id), guest),
    ]);
    const before = previous.exists()
      ? zGuest.parse({ ...previous.data(), id: guest.id, eventId: guest.eventId })
      : null;

    const nextHashes = new Set(
      await Promise.all([guest.email, guest.phone].filter(Boolean).map((c) => contactHash(c))),
    );
    const prevHashes = before
      ? await Promise.all([before.email, before.phone].filter(Boolean).map((c) => contactHash(c)))
      : [];

    await Promise.all([
      ...[...nextHashes].map((h) => setDoc(path(h), { guestId: guest.id })),
      ...prevHashes.filter((h) => !nextHashes.has(h)).map((h) => deleteDoc(path(h))),
    ]);
  },

  async adminDeleteGuest(eventId, guestId) {
    const db = getDb();
    const snap = await getDoc(doc(db, "events", eventId, "guests", guestId));
    if (snap.exists()) {
      const g = zGuest.parse({ ...snap.data(), id: guestId, eventId });
      const hashes = await Promise.all(
        [g.email, g.phone].filter(Boolean).map((c) => contactHash(c)),
      );
      await Promise.all(hashes.map((h) => deleteDoc(doc(db, "events", eventId, "guestLookup", h))));
    }
    await deleteDoc(doc(db, "events", eventId, "guests", guestId));
    await deleteDoc(doc(db, "events", eventId, "rsvps", guestId));
  },

  async adminListRsvps(eventId) {
    const snap = await getDocs(sub(eventId, "rsvps"));
    return snap.docs.map((d) => zRsvp.parse({ ...d.data(), eventId, guestId: d.id }));
  },
  /** Collection-group read across every guest's nested requests (admin only). */
  async adminListPlusOnes(eventId) {
    const snap = await getDocs(
      query(collectionGroup(getDb(), "plusOneRequests"), where("eventId", "==", eventId)),
    );
    return parseAll(zPlusOneRequest, snap.docs).map((r) => ({ ...r, eventId }));
  },
  async adminSavePlusOne(req) {
    await setDoc(
      doc(getDb(), "events", req.eventId, "guests", req.guestId, "plusOneRequests", req.id),
      req,
    );
  },

  async adminSaveEvent(event) {
    await setDoc(doc(getDb(), "events", event.id), event);
  },
  async adminSaveSettings(settings) {
    await setDoc(doc(getDb(), "events", settings.eventId, "settings", "settings"), settings);
  },
  async adminSaveWeatherSettings(w) {
    await setDoc(doc(getDb(), "events", w.eventId, "weatherSettings", "settings"), w);
  },

  async adminSaveScheduleItem(item) {
    await setDoc(doc(getDb(), "events", item.eventId, "schedule", item.id), item);
  },
  async adminDeleteScheduleItem(eventId, id) {
    await deleteDoc(doc(getDb(), "events", eventId, "schedule", id));
  },

  async adminSaveHotel(hotel) {
    await setDoc(doc(getDb(), "events", hotel.eventId, "hotels", hotel.id), hotel);
  },
  async adminDeleteHotel(eventId, id) {
    await deleteDoc(doc(getDb(), "events", eventId, "hotels", id));
  },

  async adminSaveFaq(item) {
    await setDoc(doc(getDb(), "events", item.eventId, "faq", item.id), item);
  },
  async adminDeleteFaq(eventId, id) {
    await deleteDoc(doc(getDb(), "events", eventId, "faq", id));
  },

  async adminSaveGalleryImage(image) {
    await setDoc(doc(getDb(), "events", image.eventId, "gallery", image.id), image);
  },
  async adminDeleteGalleryImage(eventId, id) {
    await deleteDoc(doc(getDb(), "events", eventId, "gallery", id));
  },

  async adminSaveMessage(message) {
    await setDoc(doc(getDb(), "events", message.eventId, "messages", message.id), message);
  },
  async adminDeleteMessage(eventId, id) {
    await deleteDoc(doc(getDb(), "events", eventId, "messages", id));
  },

  async adminListPhotos(eventId) {
    const snap = await getDocs(sub(eventId, "photos"));
    const photos = parseAllSafe(zPhoto, snap.docs, (raw, id) => ({ ...raw, id, eventId }));
    const missing = photos.filter((p) => !p.url && p.storagePath);
    if (!missing.length) return photos;

    const { getStorage, ref, getDownloadURL } = await import("firebase/storage");
    const { getFirebaseApp } = await import("../firebase/app");
    const storage = getStorage(getFirebaseApp());
    const resolved = await Promise.all(
      missing.map(async (p) => {
        try {
          return { id: p.id, url: await getDownloadURL(ref(storage, p.storagePath)) };
        } catch {
          return null;
        }
      }),
    );
    const byId = new Map(resolved.filter(Boolean).map((r) => [r!.id, r!.url]));
    return photos.map((p) => (p.url ? p : { ...p, url: byId.get(p.id) ?? p.url }));
  },
  async adminSavePhoto(photo) {
    await setDoc(doc(getDb(), "events", photo.eventId, "photos", photo.id), photo);
  },
  async adminDeletePhoto(eventId, id) {
    // Best-effort object delete; the doc is the source of truth for the UI.
    try {
      const snap = await getDoc(doc(getDb(), "events", eventId, "photos", id));
      const path = snap.exists() ? (snap.data() as Photo).storagePath : "";
      if (path) {
        const { getStorage, ref, deleteObject } = await import("firebase/storage");
        const { getFirebaseApp } = await import("../firebase/app");
        await deleteObject(ref(getStorage(getFirebaseApp()), path));
      }
    } catch {
      /* object may already be gone */
    }
    await deleteDoc(doc(getDb(), "events", eventId, "photos", id));
  },
};

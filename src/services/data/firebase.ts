import {
  collection,
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
import { z } from "zod";
import {
  zEvent,
  zFaqItem,
  zGalleryImage,
  zGuest,
  zHotel,
  zMessage,
  zPlusOneRequest,
  zRsvp,
  zScheduleItem,
  zSettings,
  zWeatherSettings,
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

  async findGuest(eventId, contact) {
    const n = contact.trim().toLowerCase();
    const field = n.includes("@") ? "email" : "phone";
    const value = n.includes("@") ? n : n.replace(/[^\d+]/g, "").replace(/^00/, "+").replace(/^0/, "+49");
    const snap = await getDocs(query(sub(eventId, "guests"), where(field, "==", value), limit(1)));
    const d = snap.docs[0];
    return d ? zGuest.parse({ ...d.data(), id: d.id, eventId }) : null;
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

  async createPlusOneRequest(req) {
    await setDoc(doc(getDb(), "events", req.eventId, "plusOneRequests", req.id), req);
  },

  async listPlusOneRequests(eventId, guestId) {
    const snap = await getDocs(
      query(sub(eventId, "plusOneRequests"), where("guestId", "==", guestId)),
    );
    return parseAll(zPlusOneRequest, snap.docs).map((r) => ({ ...r, eventId }));
  },

  /* ——— admin (security enforced by firestore.rules, not by this file) ——— */

  async adminListGuests(eventId) {
    const snap = await getDocs(sub(eventId, "guests"));
    return parseAll(zGuest, snap.docs).map((g) => ({ ...g, eventId }));
  },
  async adminSaveGuest(guest) {
    await setDoc(doc(getDb(), "events", guest.eventId, "guests", guest.id), guest);
  },
  async adminDeleteGuest(eventId, guestId) {
    await deleteDoc(doc(getDb(), "events", eventId, "guests", guestId));
  },

  async adminListRsvps(eventId) {
    const snap = await getDocs(sub(eventId, "rsvps"));
    return snap.docs.map((d) => zRsvp.parse({ ...d.data(), eventId, guestId: d.id }));
  },
  async adminListPlusOnes(eventId) {
    const snap = await getDocs(sub(eventId, "plusOneRequests"));
    return parseAll(zPlusOneRequest, snap.docs).map((r) => ({ ...r, eventId }));
  },
  async adminSavePlusOne(req) {
    await setDoc(doc(getDb(), "events", req.eventId, "plusOneRequests", req.id), req);
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
};

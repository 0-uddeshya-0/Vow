import type {
  EventDoc,
  FaqItem,
  GalleryImage,
  Hotel,
  Message,
  PlusOneRequest,
  Rsvp,
  ScheduleItem,
  Settings,
  WeatherSettings,
} from "../../types";
import type { DataSource } from "./types";
import { defaultDb, type SeedDb } from "./seedData";

/**
 * Seed data source — a complete demo event so the app (and the CMS) can be
 * exercised without Firebase. The whole database is one localStorage
 * document, so admin edits survive a reload exactly like the real backend.
 * Reset by clearing `vow.seed.db.v1`.
 */

const DB_KEY = "vow.seed.db.v1";
const RSVP_KEY = "vow.seed.rsvps.v1";
const PLUSONE_KEY = "vow.seed.plusones.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...(JSON.parse(raw) as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — edits stay in memory for this session */
  }
}

const db: SeedDb = read<SeedDb>(DB_KEY, defaultDb());
let rsvps: Rsvp[] = (() => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY) ?? "[]") as Rsvp[];
  } catch {
    return [];
  }
})();
let plusOnes: PlusOneRequest[] = (() => {
  try {
    return JSON.parse(localStorage.getItem(PLUSONE_KEY) ?? "[]") as PlusOneRequest[];
  } catch {
    return [];
  }
})();

const saveDb = () => write(DB_KEY, db);
const saveRsvps = () => write(RSVP_KEY, rsvps);
const savePlusOnes = () => write(PLUSONE_KEY, plusOnes);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LATENCY = 320; // lets skeleton loaders actually appear in the demo

function normalizeContact(c: string): string {
  const t = c.trim().toLowerCase();
  return t.includes("@") ? t : t.replace(/[^\d+]/g, "").replace(/^00/, "+").replace(/^0/, "+49");
}

/** Upsert by id into a collection, then persist. */
function upsert<T extends { id: string }>(list: T[], item: T): void {
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) list[i] = item;
  else list.push(item);
  saveDb();
}
function remove<T extends { id: string }>(list: T[], id: string): void {
  const i = list.findIndex((x) => x.id === id);
  if (i >= 0) list.splice(i, 1);
  saveDb();
}
const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const seedDataSource: DataSource = {
  kind: "seed",

  async getEventBySlug(slug) {
    await wait(LATENCY);
    return slug === db.event.slug ? db.event : null;
  },

  async findGuest(eventId, contact) {
    await wait(LATENCY);
    const n = normalizeContact(contact);
    return (
      db.guests.find(
        (g) => g.eventId === eventId && (g.email.toLowerCase() === n || g.phone === n),
      ) ?? null
    );
  },

  async getGuest(eventId, guestId) {
    await wait(80);
    return db.guests.find((g) => g.eventId === eventId && g.id === guestId) ?? null;
  },

  async listSchedule(eventId) {
    await wait(LATENCY);
    return db.schedule.filter((s) => s.eventId === eventId).sort(byOrder);
  },

  async listHotels(eventId) {
    await wait(LATENCY);
    return db.hotels.filter((h) => h.eventId === eventId).sort(byOrder);
  },

  async listFaq(eventId) {
    await wait(LATENCY);
    return db.faq.filter((f) => f.eventId === eventId).sort(byOrder);
  },

  async listGallery(eventId) {
    await wait(LATENCY);
    return db.gallery.filter((g) => g.eventId === eventId).sort(byOrder);
  },

  async listMessages(eventId) {
    await wait(LATENCY);
    return db.messages.filter((m) => m.eventId === eventId);
  },

  async getSettings(eventId) {
    await wait(120);
    return db.settings.eventId === eventId ? db.settings : null;
  },

  async getWeatherSettings(eventId) {
    await wait(80);
    return db.weatherSettings.eventId === eventId ? db.weatherSettings : null;
  },

  async getRsvp(eventId, guestId) {
    await wait(150);
    return rsvps.find((r) => r.eventId === eventId && r.guestId === guestId) ?? null;
  },

  async saveRsvp(rsvp) {
    await wait(400);
    const i = rsvps.findIndex((r) => r.eventId === rsvp.eventId && r.guestId === rsvp.guestId);
    if (i >= 0) rsvps[i] = rsvp;
    else rsvps.push(rsvp);
    saveRsvps();
  },

  async createPlusOneRequest(req) {
    await wait(300);
    plusOnes.push(req);
    savePlusOnes();
  },

  async listPlusOneRequests(eventId, guestId) {
    await wait(120);
    return plusOnes.filter((r) => r.eventId === eventId && r.guestId === guestId);
  },

  /* ——— admin ——— */

  async adminListGuests(eventId) {
    await wait(200);
    return db.guests.filter((g) => g.eventId === eventId);
  },
  async adminSaveGuest(guest) {
    await wait(180);
    upsert(db.guests, guest);
  },
  async adminDeleteGuest(_eventId, guestId) {
    await wait(180);
    remove(db.guests, guestId);
    rsvps = rsvps.filter((r) => r.guestId !== guestId);
    saveRsvps();
  },

  async adminListRsvps(eventId) {
    await wait(200);
    return rsvps.filter((r) => r.eventId === eventId);
  },
  async adminListPlusOnes(eventId) {
    await wait(160);
    return plusOnes.filter((p) => p.eventId === eventId);
  },
  async adminSavePlusOne(req) {
    await wait(160);
    const i = plusOnes.findIndex((p) => p.id === req.id);
    if (i >= 0) plusOnes[i] = req;
    else plusOnes.push(req);
    savePlusOnes();
  },

  async adminSaveEvent(event: EventDoc) {
    await wait(180);
    db.event = event;
    saveDb();
  },
  async adminSaveSettings(settings: Settings) {
    await wait(180);
    db.settings = settings;
    saveDb();
  },
  async adminSaveWeatherSettings(w: WeatherSettings) {
    await wait(150);
    db.weatherSettings = w;
    saveDb();
  },

  async adminSaveScheduleItem(item: ScheduleItem) {
    await wait(160);
    upsert(db.schedule, item);
  },
  async adminDeleteScheduleItem(_eventId, id) {
    await wait(160);
    remove(db.schedule, id);
  },

  async adminSaveHotel(hotel: Hotel) {
    await wait(160);
    upsert(db.hotels, hotel);
  },
  async adminDeleteHotel(_eventId, id) {
    await wait(160);
    remove(db.hotels, id);
  },

  async adminSaveFaq(item: FaqItem) {
    await wait(160);
    upsert(db.faq, item);
  },
  async adminDeleteFaq(_eventId, id) {
    await wait(160);
    remove(db.faq, id);
  },

  async adminSaveGalleryImage(image: GalleryImage) {
    await wait(160);
    upsert(db.gallery, image);
  },
  async adminDeleteGalleryImage(_eventId, id) {
    await wait(160);
    remove(db.gallery, id);
  },

  async adminSaveMessage(message: Message) {
    await wait(160);
    upsert(db.messages, message);
  },
  async adminDeleteMessage(_eventId, id) {
    await wait(160);
    remove(db.messages, id);
  },
};

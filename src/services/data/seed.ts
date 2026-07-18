import type {
  EventDoc,
  FaqItem,
  GalleryImage,
  Guest,
  Hotel,
  Message,
  PlusOneRequest,
  Rsvp,
  ScheduleItem,
  Settings,
} from "../../types";
import type { DataSource } from "./types";

/**
 * Seed data source — a complete demo event so the app is never empty and can
 * be exercised without Firebase. Everything content-shaped is PLACEHOLDER
 * (event.placeholder = true renders a visible "demo content" ribbon):
 * the real schedule/details are decided by the couple and entered in the
 * Admin CMS. Times here are merely a plausible, logically ordered sequence.
 * Guest-side writes (RSVP, plus-one) persist to localStorage.
 */

const EVENT_ID = "demo-wedding";

const event: EventDoc = {
  id: EVENT_ID,
  slug: "michael-dina",
  coupleNames: "Michael & Dina",
  mark: "Wir heiraten",
  date: "2026-09-18",
  timezone: "Europe/Berlin",
  welcome: {
    en: "We would love nothing more than to celebrate this day with you.",
    de: "Wir wünschen uns nichts mehr, als diesen Tag mit euch zu feiern.",
  },
  intro: {
    en: "One Friday in September — our vows, a toast, and an evening by the Danube.",
    de: "Ein Freitag im September — unser Ja-Wort, ein Anstoßen und ein Abend an der Donau.",
  },
  rsvpDeadline: "2026-08-30",
  heroIllustrationUrl: "",
  theme: { defaultMode: "light" },
  placeholder: true,
};

const guests: Guest[] = [
  {
    id: "g-demo",
    eventId: EVENT_ID,
    fullName: "Demo Guest",
    email: "demo@vow.app",
    phone: "+4915112345678",
    roles: ["Guest"],
    language: "en",
    invitationStatus: "invited",
    reminderCount: 0,
    lastReminderAt: "",
    createdVia: "admin",
  },
  {
    id: "g-witness",
    eventId: EVENT_ID,
    fullName: "Wanda Witness",
    email: "witness@vow.app",
    phone: "+4915187654321",
    roles: ["Guest", "Witness"],
    language: "de",
    invitationStatus: "invited",
    reminderCount: 0,
    lastReminderAt: "",
    createdVia: "admin",
  },
];

const ph = (en: string, de: string) => ({ en, de });

const schedule: ScheduleItem[] = [
  {
    id: "s1",
    eventId: EVENT_ID,
    order: 1,
    title: ph("Civil ceremony", "Standesamtliche Trauung"),
    description: ph(
      "Placeholder — the couple will confirm the plan.",
      "Platzhalter — der Ablauf wird noch bestätigt.",
    ),
    imageUrl: "",
    date: "2026-09-18",
    start: "10:00",
    end: "10:45",
    location: {
      name: "Standesamt Neu-Ulm",
      address: "Augsburger Str. 15, 89231 Neu-Ulm",
      lat: null,
      lng: null,
      googleMapsUrl: "https://maps.app.goo.gl/VS8DQ3S648oC6GFa7",
      appleMapsUrl: "",
      osmUrl: "",
    },
    notes: null,
    visibility: { allowedRoles: [], allowedGuests: [] },
  },
  {
    id: "s2",
    eventId: EVENT_ID,
    order: 2,
    title: ph("Witnesses arrive early", "Trauzeugen kommen früher"),
    description: ph(
      "Demo of a role-targeted item — only Witnesses see this.",
      "Demo für rollenbasierte Sichtbarkeit — nur Trauzeugen sehen das.",
    ),
    imageUrl: "",
    date: "2026-09-18",
    start: "09:15",
    end: "10:00",
    location: {
      name: "Standesamt Neu-Ulm",
      address: "Augsburger Str. 15, 89231 Neu-Ulm",
      lat: null,
      lng: null,
      googleMapsUrl: "https://maps.app.goo.gl/VS8DQ3S648oC6GFa7",
      appleMapsUrl: "",
      osmUrl: "",
    },
    notes: null,
    visibility: { allowedRoles: ["Witness"], allowedGuests: [] },
  },
  {
    id: "s3",
    eventId: EVENT_ID,
    order: 3,
    title: ph("Lunch together", "Gemeinsames Mittagessen"),
    description: ph("Placeholder.", "Platzhalter."),
    imageUrl: "",
    date: "2026-09-18",
    start: "11:30",
    end: "13:00",
    location: {
      name: "To be announced",
      address: "",
      lat: null,
      lng: null,
      googleMapsUrl: "",
      appleMapsUrl: "",
      osmUrl: "",
    },
    notes: null,
    visibility: { allowedRoles: [], allowedGuests: [] },
  },
  {
    id: "s4",
    eventId: EVENT_ID,
    order: 4,
    title: ph("Couple photos", "Paarfotos"),
    description: ph("Placeholder.", "Platzhalter."),
    imageUrl: "",
    date: "2026-09-18",
    start: "14:00",
    end: "15:30",
    location: {
      name: "Friedrichsau",
      address: "Friedrichsau, 89073 Ulm",
      lat: null,
      lng: null,
      googleMapsUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
      appleMapsUrl: "",
      osmUrl: "",
    },
    notes: null,
    visibility: { allowedRoles: [], allowedGuests: [] },
  },
  {
    id: "s5",
    eventId: EVENT_ID,
    order: 5,
    title: ph("Reception & dinner", "Empfang & Abendessen"),
    description: ph("Placeholder.", "Platzhalter."),
    imageUrl: "",
    date: "2026-09-18",
    start: "17:30",
    end: "22:00",
    location: {
      name: "Henrichs 161",
      address: "89231 Neu-Ulm",
      lat: null,
      lng: null,
      googleMapsUrl: "https://maps.app.goo.gl/2vWtbeAGtCnB4CLw6",
      appleMapsUrl: "",
      osmUrl: "",
    },
    notes: null,
    visibility: { allowedRoles: [], allowedGuests: [] },
  },
];

const hotels: Hotel[] = [
  {
    id: "h1",
    eventId: EVENT_ID,
    order: 1,
    name: "Me and All Hotel Ulm, by Hyatt",
    description: ph("Placeholder description.", "Platzhalter-Beschreibung."),
    images: [],
    recommended: true,
    websiteUrl: "https://share.google/xKr0E1K0p2ONAf97e",
    bookingUrl: "",
    phone: "",
    priceCategory: "€€",
    walkingMinutes: null,
    drivingMinutes: null,
    location: { name: "", address: "", lat: null, lng: null, googleMapsUrl: "", appleMapsUrl: "", osmUrl: "" },
  },
  {
    id: "h2",
    eventId: EVENT_ID,
    order: 2,
    name: "LAGO Hotel & Restaurant",
    description: ph("Placeholder description.", "Platzhalter-Beschreibung."),
    images: [],
    recommended: true,
    websiteUrl: "https://share.google/FL3CBcBRt801T8JdF",
    bookingUrl: "",
    phone: "",
    priceCategory: "€€",
    walkingMinutes: null,
    drivingMinutes: null,
    location: { name: "", address: "", lat: null, lng: null, googleMapsUrl: "", appleMapsUrl: "", osmUrl: "" },
  },
  {
    id: "h3",
    eventId: EVENT_ID,
    order: 3,
    name: "PLAZA Premium Hotel Neu-Ulm",
    description: ph("Placeholder description.", "Platzhalter-Beschreibung."),
    images: [],
    recommended: false,
    websiteUrl: "https://plazahotels.de/de/hotels/hbrp4h3hsqpdez5b6s1yjc2l/hotel-neu-ulm#hotel",
    bookingUrl: "",
    phone: "",
    priceCategory: "€€",
    walkingMinutes: null,
    drivingMinutes: null,
    location: { name: "", address: "", lat: null, lng: null, googleMapsUrl: "", appleMapsUrl: "", osmUrl: "" },
  },
  {
    id: "h4",
    eventId: EVENT_ID,
    order: 4,
    name: "Rioca Apartment Hotel Ulm",
    description: ph("Placeholder description.", "Platzhalter-Beschreibung."),
    images: [],
    recommended: false,
    websiteUrl: "https://www.rioca.eu/location/apartment-hotel-ulm/",
    bookingUrl: "",
    phone: "",
    priceCategory: "€",
    walkingMinutes: null,
    drivingMinutes: null,
    location: { name: "", address: "", lat: null, lng: null, googleMapsUrl: "", appleMapsUrl: "", osmUrl: "" },
  },
];

const faq: FaqItem[] = [
  {
    id: "f1",
    eventId: EVENT_ID,
    order: 1,
    question: ph("What is the dress code?", "Was ist der Dresscode?"),
    answer: ph("Formal — and easy on the glitter, please.", "Festlich — und bitte wenig Glitzer."),
  },
  {
    id: "f2",
    eventId: EVENT_ID,
    order: 2,
    question: ph("Can I bring my children?", "Dürfen Kinder mitkommen?"),
    answer: ph("We love your little ones, but this day is adults only.", "Wir lieben eure Kleinen, aber dieser Tag gehört den Erwachsenen."),
  },
  {
    id: "f3",
    eventId: EVENT_ID,
    order: 3,
    question: ph("Until when can I change my RSVP?", "Bis wann kann ich meine Antwort ändern?"),
    answer: ph("Until 30 August 2026 — through this site, any time.", "Bis zum 30. August 2026 — jederzeit über diese Seite."),
  },
];

const messages: Message[] = [
  {
    id: "m1",
    eventId: EVENT_ID,
    createdAt: "2026-07-18T10:00:00Z",
    title: ph("Welcome", "Willkommen"),
    body: ph(
      "This inbox shows announcements meant for you. (Demo content.)",
      "Hier erscheinen Nachrichten, die für euch bestimmt sind. (Demo-Inhalt.)",
    ),
    visibility: { allowedRoles: [], allowedGuests: [] },
  },
  {
    id: "m2",
    eventId: EVENT_ID,
    createdAt: "2026-07-18T10:05:00Z",
    title: ph("For our witnesses", "Für unsere Trauzeugen"),
    body: ph("Role-targeted demo message.", "Rollenbasierte Demo-Nachricht."),
    visibility: { allowedRoles: ["Witness"], allowedGuests: [] },
  },
];

const settings: Settings = {
  eventId: EVENT_ID,
  contact: [],
  emergency: [],
  footerText: ph("Made with love, for one Friday in September.", "Mit Liebe gemacht, für einen Freitag im September."),
};

/* ——— localStorage persistence for guest-side writes ——— */

const LS = {
  rsvp: (e: string, g: string) => `vow.seed.rsvp.${e}.${g}`,
  plusOnes: (e: string) => `vow.seed.plusones.${e}`,
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LATENCY = 350; // lets skeleton loaders actually appear in the demo

function normalizeContact(c: string): string {
  const t = c.trim().toLowerCase();
  return t.includes("@") ? t : t.replace(/[^\d+]/g, "").replace(/^00/, "+").replace(/^0/, "+49");
}

export const seedDataSource: DataSource = {
  kind: "seed",

  async getEventBySlug(slug) {
    await wait(LATENCY);
    return slug === event.slug ? event : null;
  },

  async findGuest(eventId, contact) {
    await wait(LATENCY);
    const n = normalizeContact(contact);
    return (
      guests.find(
        (g) => g.eventId === eventId && (g.email.toLowerCase() === n || g.phone === n),
      ) ?? null
    );
  },

  async getGuest(eventId, guestId) {
    await wait(80);
    return guests.find((g) => g.eventId === eventId && g.id === guestId) ?? null;
  },

  async listSchedule(eventId) {
    await wait(LATENCY);
    return schedule.filter((s) => s.eventId === eventId).sort((a, b) => a.order - b.order);
  },

  async listHotels(eventId) {
    await wait(LATENCY);
    return hotels.filter((h) => h.eventId === eventId).sort((a, b) => a.order - b.order);
  },

  async listFaq(eventId) {
    await wait(LATENCY);
    return faq.filter((f) => f.eventId === eventId).sort((a, b) => a.order - b.order);
  },

  async listGallery(): Promise<GalleryImage[]> {
    await wait(LATENCY);
    return []; // admin uploads land here in P2/P3
  },

  async listMessages(eventId) {
    await wait(LATENCY);
    return messages.filter((m) => m.eventId === eventId);
  },

  async getSettings(eventId) {
    await wait(120);
    return settings.eventId === eventId ? settings : null;
  },

  async getRsvp(eventId, guestId) {
    await wait(150);
    return read<Rsvp>(LS.rsvp(eventId, guestId));
  },

  async saveRsvp(rsvp) {
    await wait(400);
    write(LS.rsvp(rsvp.eventId, rsvp.guestId), rsvp);
  },

  async createPlusOneRequest(req) {
    await wait(300);
    const all = read<PlusOneRequest[]>(LS.plusOnes(req.eventId)) ?? [];
    write(LS.plusOnes(req.eventId), [...all, req]);
  },

  async listPlusOneRequests(eventId, guestId) {
    await wait(120);
    return (read<PlusOneRequest[]>(LS.plusOnes(eventId)) ?? []).filter(
      (r) => r.guestId === guestId,
    );
  },
};

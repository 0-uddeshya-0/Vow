import type {
  EventDoc,
  FaqItem,
  GalleryImage,
  Guest,
  Embed,
  Gift,
  Hotel,
  Promo,
  Message,
  ScheduleItem,
  Settings,
  WeatherSettings,
} from "../../types";
/**
 * The couple's illustration lives in public/ deliberately. A bundled import
 * resolves to "/src/assets/…" under the dev server and to a hashed filename
 * after a build, so importing starter content from a dev session persisted a
 * URL that 404s in production. A public asset has one stable path in both.
 */
const coupleArt = `${import.meta.env.BASE_URL}couple.png`;

/**
 * Factory defaults for the demo event. Everything content-shaped is
 * PLACEHOLDER (`placeholder: true` renders a visible ribbon): the real
 * schedule and details are decided by the couple and entered in the Admin
 * CMS. Times below are only a plausible, logically ordered sequence.
 */

export const EVENT_ID = "demo-wedding";
export const ph = (en: string, de: string) => ({ en, de });

const EMPTY_LOCATION = {
  name: "",
  address: "",
  lat: null,
  lng: null,
  googleMapsUrl: "",
  appleMapsUrl: "",
  osmUrl: "",
};

export type SeedDb = {
  event: EventDoc;
  guests: Guest[];
  schedule: ScheduleItem[];
  hotels: Hotel[];
  faq: FaqItem[];
  gallery: GalleryImage[];
  messages: Message[];
  gifts: Gift[];
  promos: Promo[];
  embeds: Embed[];
  settings: Settings;
  weatherSettings: WeatherSettings;
};

export function defaultDb(): SeedDb {
  return {
    event: {
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
      heroIllustrationUrl: coupleArt,
      theme: { defaultMode: "light", sage: "", gold: "", bgLight: "", bgDark: "" },
      placeholder: true,
    },

    guests: [
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
    ],

    schedule: [
      {
        id: "s1",
        eventId: EVENT_ID,
        icon: "church",
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
          ...EMPTY_LOCATION,
          name: "Standesamt Neu-Ulm",
          address: "Augsburger Str. 15, 89231 Neu-Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/VS8DQ3S648oC6GFa7",
        },
        notes: null,
        parkingNote: null,
        parkingLocation: null,
        visibility: { allowedRoles: [], allowedGuests: [] },
      },
      {
        id: "s2",
        eventId: EVENT_ID,
        icon: "guests",
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
          ...EMPTY_LOCATION,
          name: "Standesamt Neu-Ulm",
          address: "Augsburger Str. 15, 89231 Neu-Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/VS8DQ3S648oC6GFa7",
        },
        notes: null,
        parkingNote: null,
        parkingLocation: null,
        visibility: { allowedRoles: ["Witness"], allowedGuests: [] },
      },
      {
        id: "s3",
        eventId: EVENT_ID,
        icon: "lunch",
        order: 3,
        title: ph("Lunch together", "Gemeinsames Mittagessen"),
        description: ph("Placeholder.", "Platzhalter."),
        imageUrl: "",
        date: "2026-09-18",
        start: "11:30",
        end: "13:00",
        location: { ...EMPTY_LOCATION, name: "To be announced" },
        notes: null,
        parkingNote: null,
        parkingLocation: null,
        visibility: { allowedRoles: [], allowedGuests: [] },
      },
      {
        id: "s4",
        eventId: EVENT_ID,
        icon: "camera",
        order: 4,
        title: ph("Couple photos", "Paarfotos"),
        description: ph("Placeholder.", "Platzhalter."),
        imageUrl: "",
        date: "2026-09-18",
        start: "14:00",
        end: "15:30",
        location: {
          ...EMPTY_LOCATION,
          name: "Friedrichsau",
          address: "Friedrichsau, 89073 Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
        },
        notes: null,
        parkingNote: null,
        parkingLocation: null,
        visibility: { allowedRoles: [], allowedGuests: [] },
      },
      {
        id: "s5",
        eventId: EVENT_ID,
        icon: "dinner",
        order: 5,
        title: ph("Reception & dinner", "Empfang & Abendessen"),
        description: ph("Placeholder.", "Platzhalter."),
        imageUrl: "",
        date: "2026-09-18",
        start: "17:30",
        end: "22:00",
        location: {
          ...EMPTY_LOCATION,
          name: "Henrichs 161",
          address: "89231 Neu-Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/2vWtbeAGtCnB4CLw6",
        },
        notes: null,
        parkingNote: ph(
          "Placeholder — per-stop parking info is edited in the Admin CMS.",
          "Platzhalter — Parkinfos pro Ort werden im Admin-CMS gepflegt.",
        ),
        parkingLocation: {
          ...EMPTY_LOCATION,
          name: "Parkplatz Friedrichsau",
          address: "Friedrichsau, 89073 Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
        },
        visibility: { allowedRoles: [], allowedGuests: [] },
      },
    ],

    hotels: [
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
        location: { ...EMPTY_LOCATION },
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
        location: { ...EMPTY_LOCATION },
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
        location: { ...EMPTY_LOCATION },
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
        location: { ...EMPTY_LOCATION },
      },
    ],

    faq: [
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
        answer: ph(
          "We love your little ones, but this day is adults only.",
          "Wir lieben eure Kleinen, aber dieser Tag gehört den Erwachsenen.",
        ),
      },
      {
        id: "f3",
        eventId: EVENT_ID,
        order: 3,
        question: ph("Until when can I change my RSVP?", "Bis wann kann ich meine Antwort ändern?"),
        answer: ph(
          "Until 30 August 2026 — through this site, any time.",
          "Bis zum 30. August 2026 — jederzeit über diese Seite.",
        ),
      },
    ],

    gallery: [],

    messages: [
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
    ],

    gifts: [
      {
        id: "g1",
        eventId: EVENT_ID,
        order: 1,
        title: ph("Honeymoon fund", "Flitterwochen-Kasse"),
        description: ph(
          "Your presence is the real gift — but if you'd like to help us toward our honeymoon, thank you. (Demo content.)",
          "Dass ihr da seid, ist das schönste Geschenk — wer mag, kann etwas zu unseren Flitterwochen beitragen. (Demo-Inhalt.)",
        ),
        url: "https://example.com/honeymoon-fund",
        imageUrl: "",
      },
      {
        id: "g2",
        eventId: EVENT_ID,
        order: 2,
        title: ph("Our registry", "Unsere Wunschliste"),
        description: ph(
          "A few things for our new home, if you prefer a classic gift. (Demo content.)",
          "Ein paar Dinge für unser Zuhause, falls ihr ein klassisches Geschenk bevorzugt. (Demo-Inhalt.)",
        ),
        url: "https://example.com/registry",
        imageUrl: "",
      },
    ],

    promos: [
      {
        id: "pr1",
        eventId: EVENT_ID,
        order: 1,
        label: ph("Photographer", "Fotograf"),
        title: ph("Studio Lichtblick", "Studio Lichtblick"),
        body: ph(
          "The photographer we love — ask about guest sessions. (Demo content.)",
          "Unser Lieblingsfotograf — fragt nach Gäste-Shootings. (Demo-Inhalt.)",
        ),
        url: "https://example.com/photographer",
        imageUrl: "",
      },
      {
        id: "pr2",
        eventId: EVENT_ID,
        order: 2,
        label: ph("Taxi", "Taxi"),
        title: ph("Donau Taxi Ulm", "Donau Taxi Ulm"),
        body: ph(
          "Reliable late-night rides back to your hotel. (Demo content.)",
          "Zuverlässig auch spätabends zurück zum Hotel. (Demo-Inhalt.)",
        ),
        url: "https://example.com/taxi",
        imageUrl: "",
      },
    ],

    embeds: [
      {
        id: "em1",
        eventId: EVENT_ID,
        order: 1,
        title: ph("Venue map", "Karte"),
        url: "https://www.openstreetmap.org/export/embed.html?bbox=9.98%2C48.38%2C10.03%2C48.41&layer=mapnik",
        height: 360,
      },
    ],

    // Demo values only — no real personal numbers live in this public repo.
    settings: {
      eventId: EVENT_ID,
      contact: [
        { label: "Groom", name: "Michael", phone: "+490000000001", email: "" },
        { label: "Bride", name: "Dina", phone: "+490000000002", email: "" },
      ],
      emergency: [
        { label: ph("Taxi", "Taxi"), phone: "+490000000003" },
        { label: ph("Emergency (EU)", "Notruf (EU)"), phone: "112" },
      ],
      parking: {
        text: ph(
          "Placeholder — parking details are added in the Admin CMS.",
          "Platzhalter — Parkinfos werden im Admin-CMS gepflegt.",
        ),
        location: {
          ...EMPTY_LOCATION,
          name: "Parkplatz Friedrichsau",
          address: "Friedrichsau, 89073 Ulm",
          googleMapsUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
        },
      },
      footerText: ph(
        "Made with love, for one Friday in September.",
        "Mit Liebe gemacht, für einen Freitag im September.",
      ),
    },

    weatherSettings: {
      eventId: EVENT_ID,
      enabled: true,
      daysBefore: 7,
      lat: 48.3984, // Ulm — replaced by the venue coordinates in the CMS
      lng: 9.9916,
    },
  };
}

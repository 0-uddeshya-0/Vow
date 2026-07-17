/**
 * Vow · wedding configuration
 * The single source of structured wedding data. Swap this file (and the i18n
 * dictionaries) to reuse the site for another wedding.
 *
 * PRIVACY RULE — this file is public (public repo, public JS bundle):
 * no personal phone numbers, no booking codes, no guest data. Those load at
 * runtime via `runtimeContent` (Supabase `site_content`, or content.local.json
 * in dev) and are typed in `RuntimeContent` below.
 */

export type ScheduleMoment = {
  id: string;
  /** 24h "HH:MM" */
  start: string;
  end?: string;
  /** i18n key for title + description */
  key: string;
  venue: string;
  mapUrl: string;
  /**
   * TODO(open question for the couple): are the two photo blocks
   * guest-facing, or couple/witnesses only? Flagged in UI copy until answered.
   */
  guestFacing: boolean;
  /** reserved mount for the future animated Michael & Dina character layer */
  scene: string;
};

export type Hotel = {
  id: string;
  name: string;
  url: string;
  /**
   * TODO: hotel phone numbers not yet provided — booking is by phone with the
   * runtime booking code. Until numbers arrive, the UI links to the hotel page.
   */
  phone?: string;
};

const hotels: Hotel[] = [
  {
    id: "meandall",
    name: "Me and All Hotel Ulm, by Hyatt",
    url: "https://share.google/xKr0E1K0p2ONAf97e",
  },
  {
    id: "lago",
    name: "LAGO Hotel & Restaurant",
    url: "https://share.google/FL3CBcBRt801T8JdF",
  },
  {
    id: "plaza",
    name: "PLAZA Premium Hotel Neu-Ulm",
    url: "https://plazahotels.de/de/hotels/hbrp4h3hsqpdez5b6s1yjc2l/hotel-neu-ulm#hotel",
  },
  {
    id: "rioca",
    name: "Rioca Apartment Hotel Ulm",
    url: "https://www.rioca.eu/location/apartment-hotel-ulm/",
  },
];

export const wedding = {
  couple: { one: "Michael", two: "Dina" },
  /** The couple's mark, from the flyer — stays German in every language. */
  mark: "Wir heiraten",
  date: {
    iso: "2026-09-18",
    /** first & last guest-facing times of the day */
    dayStart: "11:30",
    dayEnd: "22:00",
    timezone: "Europe/Berlin",
  },
  rsvpDeadlineIso: "2026-08-30",
  ceremonyVenue: "Standesamt Neu-Ulm",

  schedule: [
    {
      id: "standesamt",
      start: "11:30",
      end: "12:30",
      key: "ceremony",
      venue: "Standesamt Neu-Ulm",
      mapUrl: "https://maps.app.goo.gl/VS8DQ3S648oC6GFa7",
      guestFacing: true,
      scene: "rings",
    },
    {
      id: "fotos-muenster",
      start: "13:00",
      end: "14:00",
      key: "photosMinster",
      venue: "Ulmer Münster",
      mapUrl: "https://maps.app.goo.gl/6irwsZKRb9UR6SQy8",
      guestFacing: true, // TODO confirm with couple
      scene: "minster",
    },
    {
      id: "fotos-friedrichsau",
      start: "14:30",
      end: "15:30",
      key: "photosPark",
      venue: "Friedrichsau",
      mapUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
      guestFacing: true, // TODO confirm with couple
      scene: "park",
    },
    {
      id: "autokorso",
      start: "15:30",
      end: "17:00",
      key: "parade",
      venue: "Parkplatz Friedrichsau",
      mapUrl: "https://maps.app.goo.gl/S6XAKRDksnCRHgkW8",
      guestFacing: true,
      scene: "cars",
    },
    {
      id: "empfang",
      start: "17:30",
      end: "18:30",
      key: "reception",
      venue: "Henrichs 161",
      mapUrl: "https://maps.app.goo.gl/2vWtbeAGtCnB4CLw6",
      guestFacing: true,
      scene: "toast",
    },
    {
      id: "dinner",
      start: "18:30",
      end: "22:00",
      key: "dinner",
      venue: "Henrichs 161",
      mapUrl: "https://maps.app.goo.gl/2vWtbeAGtCnB4CLw6",
      guestFacing: true,
      scene: "dance",
    },
  ] satisfies ScheduleMoment[],

  hotels,

  /** rooms held in each hotel until the RSVP deadline */
  hotelHoldUntilIso: "2026-08-30",

  taxi: {
    /** public business numbers, fine for the repo */
    providers: [{ name: "Taxi Ulm 24", phone: "+4915127030000" }],
    searchUrl: "https://www.google.com/maps/search/Taxi+Neu-Ulm",
  },

  dietaryOptions: ["vegan", "vegetarian", "glutenFree", "lactoseFree"] as const,
} as const;

export type DietaryOption = (typeof wedding.dietaryOptions)[number];

/** Values that must NOT live in this repo — injected at runtime. */
export type RuntimeContent = {
  /** hotel booking code guests mention on the phone */
  bookingCode: string | null;
  /** emergency contact on the day (tel: format) */
  emergencyPhone: string | null;
  /** admin-editable menu/info block, plain text per language */
  menu: { en: string; de: string } | null;
};

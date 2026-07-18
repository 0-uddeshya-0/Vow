import { z } from "zod";

/**
 * Vow · domain model. Every entity is scoped by `eventId` — this is an event
 * platform; the wedding is only the first event. Zod is the single source of
 * truth: Firestore documents are parsed through these schemas at the data
 * layer, and the same schemas validate admin/guest input.
 */

export const zLocalizedText = z.object({ en: z.string(), de: z.string() });
export type LocalizedText = z.infer<typeof zLocalizedText>;

export const zRole = z.string().min(1); // arbitrary roles: Guest, Family, Witness, Bride, …
export type Role = z.infer<typeof zRole>;

const zId = z.string().min(1);
const zIsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const zTime = z.string().regex(/^\d{2}:\d{2}$/);

export const zVisibility = z.object({
  /** empty arrays = visible to everyone */
  allowedRoles: z.array(zRole).default([]),
  allowedGuests: z.array(zId).default([]),
});
export type Visibility = z.infer<typeof zVisibility>;

export const zEvent = z.object({
  id: zId,
  slug: z.string().min(1),
  coupleNames: z.string().min(1), // display, e.g. "Michael & Dina"
  /** script mark shown above the names (kept in original language) */
  mark: z.string().default(""),
  date: zIsoDate,
  timezone: z.string().default("Europe/Berlin"),
  welcome: zLocalizedText,
  intro: zLocalizedText,
  rsvpDeadline: zIsoDate,
  /** hero illustration (couple art) — url into Storage/assets; empty = monogram fallback */
  heroIllustrationUrl: z.string().default(""),
  theme: z
    .object({ defaultMode: z.enum(["light", "dark"]).default("light") })
    .default({ defaultMode: "light" }),
  placeholder: z.boolean().default(false), // seed/demo content flag, shown in UI
});
export type EventDoc = z.infer<typeof zEvent>;

export const zGuest = z.object({
  id: zId,
  eventId: zId,
  fullName: z.string().min(1),
  email: z.string().default(""),
  phone: z.string().default(""), // normalized +49…
  roles: z.array(zRole).default(["Guest"]),
  language: z.enum(["en", "de"]).default("en"),
  invitationStatus: z
    .enum(["not_invited", "invited", "reminder_sent", "accepted", "declined", "maybe", "cancelled"])
    .default("invited"),
  reminderCount: z.number().int().default(0),
  lastReminderAt: z.string().default(""),
  createdVia: z.enum(["admin", "plus_one"]).default("admin"),
});
export type Guest = z.infer<typeof zGuest>;

export const zLocation = z.object({
  name: z.string().default(""),
  address: z.string().default(""),
  lat: z.number().nullable().default(null),
  lng: z.number().nullable().default(null),
  /** explicit override links; when empty the app builds them from address/latlng */
  googleMapsUrl: z.string().default(""),
  appleMapsUrl: z.string().default(""),
  osmUrl: z.string().default(""),
});
export type Location = z.infer<typeof zLocation>;

export const zScheduleItem = z.object({
  id: zId,
  eventId: zId,
  order: z.number(),
  title: zLocalizedText,
  description: zLocalizedText,
  imageUrl: z.string().default(""),
  date: zIsoDate,
  start: zTime,
  end: zTime.nullable().default(null),
  location: zLocation,
  notes: zLocalizedText.nullable().default(null),
  visibility: zVisibility.default({ allowedRoles: [], allowedGuests: [] }),
});
export type ScheduleItem = z.infer<typeof zScheduleItem>;

export const zHotel = z.object({
  id: zId,
  eventId: zId,
  order: z.number(),
  name: z.string(),
  description: zLocalizedText,
  images: z.array(z.string()).default([]),
  recommended: z.boolean().default(false),
  websiteUrl: z.string().default(""),
  bookingUrl: z.string().default(""),
  phone: z.string().default(""),
  priceCategory: z.enum(["€", "€€", "€€€"]).default("€€"),
  walkingMinutes: z.number().nullable().default(null),
  drivingMinutes: z.number().nullable().default(null),
  location: zLocation,
});
export type Hotel = z.infer<typeof zHotel>;

export const zFaqItem = z.object({
  id: zId,
  eventId: zId,
  order: z.number(),
  question: zLocalizedText,
  answer: zLocalizedText,
});
export type FaqItem = z.infer<typeof zFaqItem>;

export const zGalleryImage = z.object({
  id: zId,
  eventId: zId,
  order: z.number(),
  url: z.string(),
  caption: zLocalizedText.nullable().default(null),
});
export type GalleryImage = z.infer<typeof zGalleryImage>;

export const zMessage = z.object({
  id: zId,
  eventId: zId,
  createdAt: z.string(),
  title: zLocalizedText,
  body: zLocalizedText,
  visibility: zVisibility.default({ allowedRoles: [], allowedGuests: [] }),
});
export type Message = z.infer<typeof zMessage>;

export const zRsvp = z.object({
  guestId: zId,
  eventId: zId,
  attending: z.enum(["yes", "no", "maybe"]),
  dietary: z.array(z.enum(["vegetarian", "vegan", "gluten_free", "lactose_free"])).default([]),
  allergies: z.string().default(""),
  message: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  updatedAt: z.string(),
});
export type Rsvp = z.infer<typeof zRsvp>;

export const zPlusOneRequest = z.object({
  id: zId,
  eventId: zId,
  guestId: zId, // requesting guest
  fullName: z.string().min(1),
  email: z.string().default(""),
  phone: z.string().default(""),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  createdAt: z.string(),
});
export type PlusOneRequest = z.infer<typeof zPlusOneRequest>;

export const zSettings = z.object({
  eventId: zId,
  contact: z
    .array(z.object({ label: z.string(), name: z.string(), phone: z.string(), email: z.string() }))
    .default([]),
  emergency: z
    .array(z.object({ label: zLocalizedText, phone: z.string() }))
    .default([]),
  parking: z
    .object({ text: zLocalizedText, location: zLocation })
    .nullable()
    .default(null),
  footerText: zLocalizedText.nullable().default(null),
});
export type Settings = z.infer<typeof zSettings>;

export const zWeatherSettings = z.object({
  eventId: zId,
  enabled: z.boolean().default(true),
  daysBefore: z.number().default(7),
  lat: z.number().nullable().default(null),
  lng: z.number().nullable().default(null),
});
export type WeatherSettings = z.infer<typeof zWeatherSettings>;

/** Personalization filter — empty lists mean public. */
export function visibleTo(v: Visibility, guest: Guest | null): boolean {
  const openRoles = v.allowedRoles.length === 0;
  const openGuests = v.allowedGuests.length === 0;
  if (openRoles && openGuests) return true;
  if (!guest) return false;
  return (
    v.allowedGuests.includes(guest.id) ||
    v.allowedRoles.some((r) => guest.roles.includes(r))
  );
}

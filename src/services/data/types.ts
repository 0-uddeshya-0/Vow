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
  WeatherSettings,
} from "../../types";

/**
 * The one seam between UI and backend. Two implementations:
 *  - seed:     local demo data (placeholder-flagged), persisted to localStorage
 *  - firebase: Firestore/Storage, active when VITE_FIREBASE_* env is present
 * The UI only ever imports `data` from ./index — swapping backends is config,
 * not code, which is what keeps the platform reusable.
 *
 * Read + guest-write methods are used by the guest app; the `admin*` methods
 * are used only by the CMS (and, in Firestore, gated by security rules).
 */
export interface DataSource {
  readonly kind: "seed" | "firebase";

  getEventBySlug(slug: string): Promise<EventDoc | null>;

  /** identify by email OR phone (normalized) */
  findGuest(eventId: string, contact: string): Promise<Guest | null>;
  getGuest(eventId: string, guestId: string): Promise<Guest | null>;

  listSchedule(eventId: string): Promise<ScheduleItem[]>;
  listHotels(eventId: string): Promise<Hotel[]>;
  listFaq(eventId: string): Promise<FaqItem[]>;
  listGallery(eventId: string): Promise<GalleryImage[]>;
  listMessages(eventId: string): Promise<Message[]>;
  getSettings(eventId: string): Promise<Settings | null>;
  getWeatherSettings(eventId: string): Promise<WeatherSettings | null>;

  getRsvp(eventId: string, guestId: string): Promise<Rsvp | null>;
  saveRsvp(rsvp: Rsvp): Promise<void>;

  createPlusOneRequest(req: PlusOneRequest): Promise<void>;
  listPlusOneRequests(eventId: string, guestId: string): Promise<PlusOneRequest[]>;

  /* ——— admin ——— */

  adminListGuests(eventId: string): Promise<Guest[]>;
  adminSaveGuest(guest: Guest): Promise<void>;
  adminDeleteGuest(eventId: string, guestId: string): Promise<void>;

  adminListRsvps(eventId: string): Promise<Rsvp[]>;
  adminListPlusOnes(eventId: string): Promise<PlusOneRequest[]>;
  adminSavePlusOne(req: PlusOneRequest): Promise<void>;

  adminSaveEvent(event: EventDoc): Promise<void>;
  adminSaveSettings(settings: Settings): Promise<void>;
  adminSaveWeatherSettings(w: WeatherSettings): Promise<void>;

  adminSaveScheduleItem(item: ScheduleItem): Promise<void>;
  adminDeleteScheduleItem(eventId: string, id: string): Promise<void>;

  adminSaveHotel(hotel: Hotel): Promise<void>;
  adminDeleteHotel(eventId: string, id: string): Promise<void>;

  adminSaveFaq(item: FaqItem): Promise<void>;
  adminDeleteFaq(eventId: string, id: string): Promise<void>;

  adminSaveGalleryImage(image: GalleryImage): Promise<void>;
  adminDeleteGalleryImage(eventId: string, id: string): Promise<void>;

  adminSaveMessage(message: Message): Promise<void>;
  adminDeleteMessage(eventId: string, id: string): Promise<void>;
}

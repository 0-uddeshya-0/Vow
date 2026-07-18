import { data } from "../data";
import { defaultDb } from "../data/seedData";

/**
 * Writes the demo event into whatever backend is active. A fresh Firestore
 * project is empty, so the site would render nothing until content exists —
 * this is the one-click bootstrap, and doubles as the "new event" starting
 * point for reusing the platform.
 *
 * Uses only the DataSource admin methods, so it is backend-agnostic and
 * subject to the same security rules as any other admin write.
 */
export async function importDemoContent(onProgress?: (step: string) => void): Promise<void> {
  const db = defaultDb();
  const step = (s: string) => onProgress?.(s);

  step("event");
  await data.adminSaveEvent(db.event);

  step("settings");
  await data.adminSaveSettings(db.settings);
  await data.adminSaveWeatherSettings(db.weatherSettings);

  step("schedule");
  for (const item of db.schedule) await data.adminSaveScheduleItem(item);

  step("hotels");
  for (const hotel of db.hotels) await data.adminSaveHotel(hotel);

  step("faq");
  for (const item of db.faq) await data.adminSaveFaq(item);

  step("messages");
  for (const m of db.messages) await data.adminSaveMessage(m);

  // Guests last: saving each one also writes its contact-hash lookup docs.
  step("guests");
  for (const g of db.guests) await data.adminSaveGuest(g);

  step("done");
}

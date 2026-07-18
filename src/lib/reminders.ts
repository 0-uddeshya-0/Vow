import type { EventDoc, Guest } from "../types";

/**
 * Pre-composed RSVP nudges in the guest's own language.
 *
 * Deliberately link-only: these open WhatsApp / the mail client with the
 * message filled in, and the admin presses send. Nothing is ever sent
 * automatically on the couple's behalf.
 */
function firstName(guest: Guest): string {
  return guest.fullName.trim().split(/\s+/)[0] ?? guest.fullName;
}

export function reminderText(guest: Guest, event: EventDoc): { subject: string; body: string } {
  const names = event.coupleNames;
  if (guest.language === "de") {
    return {
      subject: `Kurze Frage zu unserer Hochzeit — ${names}`,
      body:
        `Hallo ${firstName(guest)},\n\n` +
        "wir hoffen, es geht dir gut!\n\n" +
        "Wir wollten kurz fragen, ob du schon weißt, ob du bei unserer Hochzeit dabei sein kannst. " +
        "Wir würden uns riesig freuen, mit dir zu feiern!\n\n" +
        `Antworten kannst du hier: ${siteUrl()}\n\n` +
        `Liebe Grüße,\n${names}`,
    };
  }
  return {
    subject: `A quick question about our wedding — ${names}`,
    body:
      `Hello ${firstName(guest)},\n\n` +
      "We hope you're doing well!\n\n" +
      "We wanted to kindly ask whether you've already decided if you'll be joining us for our wedding. " +
      "We'd love to celebrate with you!\n\n" +
      `You can reply here: ${siteUrl()}\n\n` +
      `Best wishes,\n${names}`,
  };
}

function siteUrl(): string {
  return typeof window === "undefined" ? "" : `${window.location.origin}${window.location.pathname}`;
}

export function whatsappUrl(guest: Guest, event: EventDoc): string | null {
  const digits = guest.phone.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(reminderText(guest, event).body)}`;
}

export function mailtoUrl(guest: Guest, event: EventDoc): string | null {
  if (!guest.email) return null;
  const { subject, body } = reminderText(guest, event);
  return `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

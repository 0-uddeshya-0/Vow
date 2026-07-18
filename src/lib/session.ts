export type GuestSession = { eventId: string; guestId: string };

const KEY = "vow.session";

export function loadSession(): GuestSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GuestSession;
    return s.eventId && s.guestId ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(s: GuestSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ok */
  }
}

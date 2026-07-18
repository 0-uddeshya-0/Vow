import { useCallback, useSyncExternalStore } from "react";
import { clearSession, loadSession, saveSession, type GuestSession } from "../../lib/session";

/** One tiny external store so every component sees the same session state. */
let current: GuestSession | null = loadSession();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function useGuestSession() {
  const session = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );

  const signIn = useCallback((s: GuestSession) => {
    current = s;
    saveSession(s);
    emit();
  }, []);

  const signOut = useCallback(() => {
    current = null;
    clearSession();
    emit();
  }, []);

  return { session, signIn, signOut };
}

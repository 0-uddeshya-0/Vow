import { hasFirebase } from "../firebase/app";

/**
 * Admin authentication seam, mirroring the DataSource pattern.
 *
 * - firebase: real Firebase Auth (email + password, the single admin account).
 * - seed:     LOCAL DEMO ONLY. There is no backend and no real data to
 *             protect — the "database" is this browser's localStorage — so
 *             the passphrase below is a UX placeholder, NOT security. The
 *             login screen says so in plain words; never present it as
 *             protection.
 */
export type AdminUser = { email: string };

export type AdminAuth = {
  readonly kind: "seed" | "firebase";
  current(): AdminUser | null;
  subscribe(cb: (user: AdminUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
};

/* ——— seed (local demo) ——— */

const SEED_KEY = "vow.admin.demo";
const SEED_PASSPHRASE = "demo";

function makeSeedAuth(): AdminAuth {
  let user: AdminUser | null = (() => {
    try {
      const raw = sessionStorage.getItem(SEED_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  })();
  const subs = new Set<(u: AdminUser | null) => void>();
  const emit = () => subs.forEach((cb) => cb(user));

  return {
    kind: "seed",
    current: () => user,
    subscribe(cb) {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    async signIn(email, password) {
      await new Promise((r) => setTimeout(r, 250));
      if (password !== SEED_PASSPHRASE) throw new Error("wrong-passphrase");
      user = { email: email.trim() || "demo@vow.app" };
      try {
        sessionStorage.setItem(SEED_KEY, JSON.stringify(user));
      } catch {
        /* ok */
      }
      emit();
    },
    async signOut() {
      user = null;
      try {
        sessionStorage.removeItem(SEED_KEY);
      } catch {
        /* ok */
      }
      emit();
    },
  };
}

/* ——— firebase ——— */

function makeFirebaseAuth(): AdminAuth {
  let user: AdminUser | null = null;
  const subs = new Set<(u: AdminUser | null) => void>();

  // Imported lazily so the demo build never pulls in firebase/auth.
  const authPromise = (async () => {
    const [{ getAuth, onAuthStateChanged }, { getFirebaseApp }] = await Promise.all([
      import("firebase/auth"),
      import("../firebase/app"),
    ]);
    const auth = getAuth(getFirebaseApp());
    onAuthStateChanged(auth, (u) => {
      user = u?.email ? { email: u.email } : null;
      subs.forEach((cb) => cb(user));
    });
    return auth;
  })();

  return {
    kind: "firebase",
    current: () => user,
    subscribe(cb) {
      subs.add(cb);
      void authPromise;
      return () => subs.delete(cb);
    },
    async signIn(email, password) {
      const auth = await authPromise;
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signOut() {
      const auth = await authPromise;
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    },
  };
}

export const adminAuth: AdminAuth = hasFirebase ? makeFirebaseAuth() : makeSeedAuth();
export const SEED_DEMO_PASSPHRASE = SEED_PASSPHRASE;

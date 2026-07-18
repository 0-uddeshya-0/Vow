import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase is configured entirely through VITE_ env vars (documented in
 * .env.example / README). Without them the app runs on the seed data source —
 * so the repo stays public and the demo works with zero setup.
 * Client Firebase config is public by design; ALL security lives in
 * firestore.rules.
 */

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const hasFirebase: boolean = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  getDb(); // initializes `app` if needed
  return app!;
}

export function getDb(): Firestore {
  if (!hasFirebase) throw new Error("Firebase env not configured");
  if (!app) {
    app = initializeApp({
      apiKey: firebaseConfig.apiKey!,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId!,
      storageBucket: firebaseConfig.storageBucket,
      appId: firebaseConfig.appId!,
    });
    db = getFirestore(app);
  }
  return db!;
}

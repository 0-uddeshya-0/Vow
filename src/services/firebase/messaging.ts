/**
 * Web push (FCM), free-tier. The client only OPTS IN and stores its device
 * token; the couple broadcasts with scripts/send-push.mjs (Admin SDK send is
 * free — only Cloud Functions need Blaze). Everything here degrades to a no-op
 * when VITE_FIREBASE_VAPID_KEY is absent, so the app is unaffected until push
 * is configured.
 */
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { getFirebaseApp } from "./app";
import { data } from "../data";
import type { Guest } from "../../types";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

/** True only when a VAPID key is configured at build time. */
export const pushConfigured = Boolean(VAPID_KEY);

export async function pushSupported(): Promise<boolean> {
  if (!pushConfigured) return false;
  try {
    return (
      "serviceWorker" in navigator &&
      "Notification" in window &&
      (await isSupported())
    );
  } catch {
    return false;
  }
}

// A dedicated scope so FCM's worker never displaces the PWA cache worker (sw.js)
// which owns the root scope.
const MSG_SW_SCOPE = "firebase-cloud-messaging-push-scope";

let regPromise: Promise<ServiceWorkerRegistration> | null = null;
function registerMessagingSW(): Promise<ServiceWorkerRegistration> {
  if (!regPromise) {
    const base = import.meta.env.BASE_URL;
    regPromise = navigator.serviceWorker.register(`${base}firebase-messaging-sw.js`, {
      scope: `${base}${MSG_SW_SCOPE}`,
    });
  }
  return regPromise;
}

export type PushResult = "enabled" | "denied" | "unsupported" | "error";

/** Request permission, mint an FCM token, and register it for this event. */
export async function enablePush(eventId: string, guest: Guest | null): Promise<PushResult> {
  if (!(await pushSupported())) return "unsupported";
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "denied";
    const reg = await registerMessagingSW();
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg,
    });
    if (!token) return "error";
    await data.savePushToken({
      token,
      eventId,
      guestId: guest?.id ?? "",
      guestName: guest?.fullName ?? "",
      ua: navigator.userAgent.slice(0, 200),
      createdAt: new Date().toISOString(),
    });
    return "enabled";
  } catch (err) {
    console.warn("[vow] push enable failed", err);
    return "error";
  }
}

/** Show a notification for messages that arrive while the app is focused. */
export async function listenForegroundMessages(): Promise<void> {
  if (!(await pushSupported())) return;
  try {
    const messaging = getMessaging(getFirebaseApp());
    onMessage(messaging, (payload) => {
      const n = payload.notification;
      if (n?.title && Notification.permission === "granted") {
        new Notification(n.title, {
          body: n.body,
          icon: `${import.meta.env.BASE_URL}icon.svg`,
        });
      }
    });
  } catch {
    /* messaging unavailable — ignore */
  }
}

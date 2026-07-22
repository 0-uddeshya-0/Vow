/* Firebase Cloud Messaging background handler.
 * Registered at its own scope by src/services/firebase/messaging.ts so it never
 * displaces the PWA cache worker (sw.js). The config below is the public web
 * config (safe to ship — all security is in firestore.rules); messagingSenderId
 * is the project number embedded in the appId. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDBhm3hjvZ2lKGhJGc3QPpWBRBe5YoQL8M",
  authDomain: "vow-1809.firebaseapp.com",
  projectId: "vow-1809",
  storageBucket: "vow-1809.firebasestorage.app",
  messagingSenderId: "696666654769",
  appId: "1:696666654769:web:5996e05db90d4d06f0ad10",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Update";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "/icon.svg",
    badge: "/icon.svg",
  });
});

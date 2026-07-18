/**
 * Minimal service worker: makes the site installable ("Save to Home Screen")
 * and keeps it usable on venue wifi.
 *
 * Strategy is deliberately conservative — network-first for navigation so a
 * deploy is never masked by a stale shell, cache-first only for Vite's
 * content-hashed assets (whose URLs change on every build, so they can never
 * go stale). No API responses are cached: guest data must always be live.
 */
const CACHE = "vow-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch weather/API calls

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          void caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r ?? caches.match("./"))),
    );
    return;
  }

  if (/\/assets\/.+\.[0-9a-zA-Z_-]{8,}\.(js|css|woff2?|png|jpe?g|webp|svg)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            const copy = res.clone();
            void caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});

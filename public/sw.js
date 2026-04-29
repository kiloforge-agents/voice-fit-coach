/* VoiceFitCoach service worker
 * Caches the app shell so the coach is usable in airplane mode / low connectivity.
 */
const VERSION = "vfc-v1.0.0";
const APP_SHELL = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // Silently ignore — individual fetch failures shouldn't block install.
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Network-first for navigation, cache-first for everything else.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return (
            cached ||
            (await caches.match("/offline")) ||
            new Response(
              "<h1>Offline</h1><p>VoiceFitCoach will resume when you're back online.</p>",
              { headers: { "Content-Type": "text/html" } }
            )
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});

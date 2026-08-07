// Iceland Eclipse companion — offline service worker.
// Strategy: network-first for pages/RSC (fresh schedule whenever there's any
// signal), cache fallback when truly offline; stale-while-revalidate for
// hashed static assets and artist headshots; network-only for API/auth.
// Bump VERSION on any strategy change to retire old caches.
// v2: [locale] segment restructure changed RSC payload shapes — a clean cache
// avoids serving pre-i18n cached RSC against the new router tree.
// v3: 2026-08-04 map art replaced (Rostin cut, Portal added) + campground map
// added — retire caches holding the old precached festival-map.jpg.
const VERSION = "ie-v3";
const PRECACHE = `ie-precache-${VERSION}`;
const RUNTIME = `ie-runtime-${VERSION}`;

// Core routes + local assets seeded on install so the shell opens offline
// after a single online visit. Hashed JS/CSS chunks join the cache as the
// pages are actually loaded online (see the SWR branch below).
const CORE = [
  "/",
  "/schedule",
  "/map",
  "/guides",
  "/manifest.webmanifest",
  "/festival-map.jpg",
  "/campground-map.jpg",
  "/iceland-eclipse-logo.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // allSettled: a single 404/redirect must not abort the whole install.
      await Promise.allSettled(CORE.map((url) => cache.add(url)));
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== PRECACHE && k !== RUNTIME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// The page prompts the user, then tells us to activate the new worker.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isRsc(request) {
  return (
    request.headers.get("RSC") === "1" ||
    new URL(request.url).search.includes("_rsc")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // API / auth: never cache — always hit the network, degrade to a 503.
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ offline: true }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  // Page navigations + RSC payloads: network-first, cache fallback.
  if (request.mode === "navigate" || isRsc(request)) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(RUNTIME);
          cache.put(request, response.clone());
          return response;
        } catch {
          return (
            (await caches.match(request)) ||
            (await caches.match("/schedule")) ||
            (await caches.match("/")) ||
            Response.error()
          );
        }
      })()
    );
    return;
  }

  // Hashed static assets + artist headshots: stale-while-revalidate.
  if (
    url.origin === self.location.origin ||
    url.hostname === "storage.googleapis.com"
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => null);
        return cached || (await network) || Response.error();
      })()
    );
  }
});

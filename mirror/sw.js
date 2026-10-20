/* Socios.com service worker (Slice 11): offline app-shell + static asset cache.
 *
 * This is a frequently-redeployed prototype, so correctness-on-update matters
 * more than aggressive caching. Strategy:
 *   - navigations + Next.js chunks: NETWORK-FIRST (always fresh; cache is only a
 *     fallback when offline). This prevents a returning visitor from booting a
 *     stale HTML shell that references chunk hashes from an older build —
 *     the classic "page flashes then fails to load" after a redeploy.
 *   - other static assets (icons/fonts): cache-first (safe; rarely change).
 * Bumping CACHE purges every older cache on activate, clearing any poisoned
 * shell/chunks left by a previous service-worker version.
 */
const CACHE = "socios-v4"; // bumped 2026-07-02: purge stale shells cached by older SW versions
const PRECACHE = ["/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
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
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to a cached shell only when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || Response.error())),
    );
    return;
  }

  // Next.js build output (hashed but version-sensitive): network-first so a new
  // deploy is never blocked by a stale cached chunk; cache as offline fallback.
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || Response.error())),
    );
    return;
  }

  // Other static assets: cache-first, then network (and cache it).
  if (/\.(?:css|js|svg|png|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});

/* STEM Spray Wall — service worker
   Cache-first so the app + wall photo work fully offline at the wall.
   Bump CACHE_VERSION whenever you change index.html or wall.jpg so
   phones pick up the new version instead of a stale cache. */

const CACHE_VERSION = 'spraywall-v1';

/* Relative paths (no leading slash) so this works whether the app is
   hosted at username.github.io/  OR  username.github.io/spraywall/.
   './' resolves to the directory the service worker is scoped to. */
const ASSETS = [
  './',
  './index.html',
  './wall.jpg',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        // runtime-cache same-origin successful responses
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});

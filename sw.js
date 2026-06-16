
const CACHE = "petfinder-v2";
const ASSETS = [
  "/find-pet/",
  "/find-pet/index.html",
  "/find-pet/manifest.json",
  "/find-pet/sw.js"
];
const ICONS = ["/find-pet/icon-48.png","/find-pet/icon-72.png","/find-pet/icon-96.png","/find-pet/icon-128.png","/find-pet/icon-192.png","/find-pet/icon-256.png","/find-pet/icon-384.png","/find-pet/icon-512.png"];
const ALL = ASSETS.concat(ICONS).concat(["/find-pet/splash.png"]);

self.addEventListener("install", function(e) {
  self.skipWaiting();
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ALL);
  })());
});

self.addEventListener("activate", function(e) {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await clients.claim();
  })());
});

self.addEventListener("fetch", function(e) {
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    try {
      const res = await fetch(e.request);
      if (res && res.status === 200) {
        const cache = await caches.open(CACHE);
        cache.put(e.request, res.clone());
      }
      return res;
    } catch (err) {
      const cache = await caches.open(CACHE);
      const fallback = await cache.match("/find-pet/");
      return fallback || new Response("离线模式", {status: 200, headers: {"Content-Type": "text/html;charset=utf-8"}});
    }
  })());
});

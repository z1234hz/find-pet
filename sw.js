
const CACHE = "petfinder-v1";
const URLS = [
  "/find-pet/",
  "/find-pet/index.html",
  "/find-pet/manifest.json",
  "/find-pet/icon-192.png",
  "/find-pet/icon-512.png"
];
self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(e) {
  e.waitUntil(clients.claim());
});
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});

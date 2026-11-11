// Keeps the site usable offline: pages come fresh from the network (cache only when offline), other files from cache.
const CACHE = "jokerweek-v41";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res }).catch(() => caches.match(e.request).then(h => h || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => { if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res }).catch(() => hit);
    return hit || net;
  }));
});

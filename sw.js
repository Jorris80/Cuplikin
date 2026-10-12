/* Cuplikin — Service Worker (offline/PWA)
 * - Precache shell aplikasi (index.html, manifest, offline.html)
 * - Navigasi: network-first → cache → offline.html
 * - Font Google: stale-while-revalidate
 * - Permintaan API (script.google.com / googleusercontent) TIDAK di-cache di sini;
 *   data offline & antrean sinkron ditangani aplikasi via IndexedDB.
 */
var VERSION = 'cuplikin-v2.2.0';
var SHELL = ['./', './index.html', './manifest.json', './offline.html'];
var FONT_CACHE = 'cuplikin-fonts-v1';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== FONT_CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                                   // API POST → langsung ke jaringan
  var url = new URL(req.url);
  if (/script\.google(usercontent)?\.com$/.test(url.hostname)) return; // API Apps Script
  if (url.protocol === 'blob:' || url.protocol === 'data:') return;

  // Font Google: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }

  // Navigasi halaman: network-first
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put('./index.html', copy); });
      return res;
    }).catch(function () {
      return caches.match('./index.html').then(function (hit) { return hit || caches.match('./offline.html'); });
    }));
    return;
  }

  // Aset lain se-origin: cache-first
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return caches.match('./offline.html'); });
    }));
  }
});

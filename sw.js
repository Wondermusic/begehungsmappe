/*
==============================================================================
  Begehungsmappe – Service Worker
==============================================================================
  Version:   1.2.0
  Datum:     2026-10-28

  ZWECK
  -----
  Macht die App komplett offline nutzbar. Beim Installieren werden alle
  App-Dateien zwischengespeichert. Schriften von Google Fonts werden beim
  ersten Laden mit Internet ebenfalls abgelegt.

  STRATEGIE
  ---------
  - Seitenaufruf (index.html): erst Netz, bei fehlendem Netz der Cache.
    So kommen Updates an, sobald das Tablet online ist.
  - Übrige App-Dateien: erst Cache, dann Netz.
  - Google Fonts: Cache, im Hintergrund aktualisieren.
  - Die Nutzdaten (Ordner, Begehungen, Fotos) liegen in IndexedDB und
    werden vom Service Worker nicht berührt.

  UPDATE
  ------
  Bei jeder neuen App-Version CACHE_VERSION erhöhen. Alte Caches werden
  beim Aktivieren gelöscht.

  CHANGELOG
  ---------
  1.0.0 (2026-10-28)  Erste Version.
  1.1.0 (2026-10-28)  Cache-Version für App 1.1.0 (Foto-Positionen).
  1.2.0 (2026-10-28)  Cache-Version für App 1.2.0 (Radierer, Druckumfang).
==============================================================================
*/
const CACHE_VERSION = '1.2.0';
const CACHE = 'begehungsmappe-' + CACHE_VERSION;
const FONT_CACHE = 'begehungsmappe-fonts';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('begehungsmappe-') && k !== CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: Cache zuerst, im Hintergrund erneuern
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Seitenaufruf: Netz zuerst, sonst Cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Übrige App-Dateien: Cache zuerst
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});

// Surya Agencies Service Worker for PWA Android App
const CACHE_NAME = 'surya-agencies-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/socket-client.js',
  '/js/app.js',
  '/js/customer-app.js',
  '/js/shopkeeper-app.js',
  '/js/qrcode.min.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network first, fallback to cache
  if (e.request.url.includes('/api/') || e.request.url.includes('/socket.io/')) {
    return; // Pass dynamic network calls straight through
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

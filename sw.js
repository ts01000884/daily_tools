// Define a cache name
const CACHE_NAME = 'daily-tools-cache-202601211411';

// List of files to cache
const urlsToCache = [
  '/',
  '/daily_tools/',
  '/daily_tools/index.html',
  '/daily_tools/css/style.css',
  '/daily_tools/tools/microwave-converter/index.html',
  '/daily_tools/tools/microwave-converter/style.css',
  '/daily_tools/tools/microwave-converter/script.js'
];

// Install event: opens the cache and adds the files to it
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves assets from cache first, falls back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});

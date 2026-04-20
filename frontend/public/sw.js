const CACHE = 'scelta-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Never intercept API calls
  if (url.hostname.includes('onrender.com') || 
      url.hostname.includes('mongodb') ||
      e.request.url.includes('/api/')) {
    return;
  }

  // Only cache same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

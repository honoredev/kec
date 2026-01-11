// Service Worker for ultra-fast API caching
const CACHE_NAME = 'kec-api-cache-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache API responses aggressively
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only cache API requests
  if (url.hostname === 'kec-backend-1.onrender.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Check if cached response is still fresh
          if (cachedResponse) {
            const cachedTime = cachedResponse.headers.get('sw-cached-time');
            if (cachedTime && (Date.now() - parseInt(cachedTime)) < API_CACHE_DURATION) {
              console.log('⚡ Serving from SW cache:', url.pathname);
              return cachedResponse;
            }
          }
          
          // Fetch fresh data and cache it
          return fetch(event.request).then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              // Add timestamp header
              const headers = new Headers(responseClone.headers);
              headers.set('sw-cached-time', Date.now().toString());
              
              const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              });
              
              cache.put(event.request, cachedResponse);
              console.log('💾 Cached API response:', url.pathname);
            }
            return response;
          }).catch(() => {
            // Return stale cache on network error
            return cachedResponse || new Response('{"error": "Network unavailable"}', {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
  }
});

// Clean old cache entries
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
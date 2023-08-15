const staticCacheName = 'floema-v3';

self.addEventListener('install', () => {
  console.log('Service Worker installé');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activé');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== staticCacheName) {
            console.log('Suppression du cache ancien', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener('fetch', event => {
  if (
    event.request.url.includes('/assets/') &&
    (event.request.url.endsWith('.js') || event.request.url.endsWith('.css'))
  ) {
    console.log('Interception de la requête', event.request.url);

    event.respondWith(
      caches.open(staticCacheName).then(cache => {
        return cache.match(event.request).then(response => {
          return (
            response ||
            fetch(event.request).then(response => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
          );
        });
      }),
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }),
    );
  }
});

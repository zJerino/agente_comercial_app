
/**
 * AUTO-GENERATED SERVICE WORKER
 * Generado el: 22/12/2025, 1:08:56
 */

const CACHE_NAME = 'app-cache-v-1766380137409';
const ASSETS_TO_CACHE = [
  "/favicon.ico",
  "/index.html",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json",
  "/robots.txt",
  "/"
];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Network First con fallback a Cache
// Esto permite que en DESARROLLO (npm start) veas cambios si hay red,
// pero funcione Offline si la red falla.
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red funciona, guardamos una copia en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay red, buscamos en el cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Si es una navegación y no hay cache, mostrar index.html (SPA)
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

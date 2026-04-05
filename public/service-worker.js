// @ts-check

/**
 * Forzamos a TypeScript a tratar 'self' como un ServiceWorkerGlobalScope
 * @type {ServiceWorkerGlobalScope & typeof globalThis}
 */
const sw = /** @type {?} */ (self);

const CACHE_NAME = 'offline-v2';
const OFFLINE_URL = '/offline.html';

sw.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(
        new Request(OFFLINE_URL, {
          cache: 'reload',
        }),
      );
    })(),
  );
  sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in sw.registration) {
        await sw.registration.navigationPreload.enable();
      }
    })(),
  );
  sw.clients.claim();
});

sw.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;

          if (preloadResponse) {
            return preloadResponse;
          }

          return await fetch(event.request);
        } catch (error) {
          console.error('Fetch failed, returning offline page:', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);

          return (
            cachedResponse ||
            new Response('Offline', {
              headers: {
                'Content-Type': 'text/html',
              },
            })
          );
        }
      })(),
    );
  }
});

sw.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  // THE FIX: Tell TypeScript this object can hold any properties
  /** @type {any} */
  let data = {};

  try {
    data = event.data.json();
    // FIX: Log the actual object structure
    console.log('Push data received:', data);
  } catch (e) {
    console.error('Failed to parse push data as JSON:', e);
    data = {
      title: 'Notificación',
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body,
    icon:
      data.icon ||
      '/icons/shopping-cart-drug-basket-shop-buy-ecommerce-svgrepo-com.svg',
    badge: '/icons/web-app-manifest-192x192.png',
    data: data.data || {}, // Safely default to empty object
  };

  event.waitUntil(
    sw.registration.showNotification(data.title || 'Nuevo Mensaje', options),
  );
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action, notification } = event;
  const data = notification.data || {};
  let urlToOpen = '/'; // FIX: Default fallback URL

  if (action === 'openCarpeta' && data.numero) {
    urlToOpen = `https://app.rsasesorjuridico.com/Carpeta/${data.numero}`;
  } else if (action === 'openActuaciones' && data.numero && data.idProceso) {
    urlToOpen = `https://app.rsasesorjuridico.com/Carpeta/${data.numero}/ultimasActuaciones/${data.idProceso}#actuacion-${data.idRegActuacion}`;
  } else if (data.url) {
    urlToOpen = data.url;
  }

  event.waitUntil(
    sw.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const targetUrl = new URL(urlToOpen, self.location.origin).href;

        // Find ANY open tab for our app
        for (const client of clientList) {
          const clientUrlObj = new URL(client.url, self.location.origin);
          const targetUrlObj = new URL(targetUrl, self.location.origin);

          // FIX/UX UPGRADE: If they have our app open at all, focus it and navigate
          if (
            clientUrlObj.origin === targetUrlObj.origin &&
            'focus' in client
          ) {
            client.navigate(targetUrl); // Change the route of the existing tab

            return client.focus(); // Bring it to the front
          }
        }

        // If no tabs are open, spawn a new one
        if (sw.clients.openWindow) {
          return sw.clients.openWindow(urlToOpen);
        }

        return null;
      }),
  );
});

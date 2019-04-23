

const cacheName = 'pwa-conf-v1';
const staticAssets = ['./', './index.html', './app.js', './styles.css'];

self.addEventListener('install', async _event => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  console.log('evetement installlé')
});


self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('evetement activé')
});

self.addEventListener('fetch', event => {
  const req = event.request;

  if (/.*(json)$/.test(req.url)) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
  console.log('event sw installé')
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cachedResponse = await cache.match(req);
    return cachedResponse;
  }
}
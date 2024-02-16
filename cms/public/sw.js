self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
  });
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    const message = event.data;
    switch(message.type) {
        default:
            throw new Error(`Unhandled message ${message.value}`)
    }
});

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(`v1-${request.mode}`);
        const clone = networkResponse.clone();
        cache.put(request, clone);
        return networkResponse;
    } catch (e) {
        console.log('fetch error', e);
        const cacheResponse = await caches.match(request);
        console.log('cache', cacheResponse);
        return cacheResponse;
    }
}


self.addEventListener("fetch", (event) => {
    if(event.request.method === "GET") {
        event.respondWith(networkFirst(event.request));
        return;
    }
});

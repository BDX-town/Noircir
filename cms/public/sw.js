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

const queue = [];

async function networkFirstThenQueue(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (e) {
        console.warn('Unable to process, it will be added to queue', request);
        queue.push(request);
        // https://developer.mozilla.org/fr/docs/Web/HTTP/Status/202
        return new Response(null, { status: 202, statusText: 'Added to queue'})
    }
}

/**
 * 
 * @param {Request} request 
 * @returns {Response}
 */
async function networkFirstThenCache(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(`v1-${request.mode}`);
        const clone = networkResponse.clone();
        // propfind cant be cached but it's basically a get so...
        if(request.method === "PROPFIND") {
            request = new Request(request, { method: "GET"});
        }
        cache.put(request, clone);
        return networkResponse;
    } catch (e) {
        // propfind cant be cached but it's basically a get so...
        if(request.method === "PROPFIND") {
            request = new Request(request, { method: "GET"});
        }
        const cacheResponse = await caches.match(request);
        cacheResponse.headers.append('X-cached', "true");
        return cacheResponse;
    }
}


self.addEventListener("fetch", (event) => {
    // we try to fetch from network first and then from cache for every GET-like requests
    if(event.request.method !== "POST" && event.request.method !== "PUT"  && event.request.method !== "DELETE") {
        event.respondWith(networkFirstThenCache(event.request));
        return;
    } else if(event.request.method === "POST" || event.request.method === "PUT" || event.request.method === "DELETE") {
        event.respondWith(networkFirstThenQueue(event.request));
        return;
    }
});

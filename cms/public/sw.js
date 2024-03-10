const SW_MESSAGES = {
    ONLINE: "ONLINE",
    QUEUE_UPDATE: "QUEUE_UPDATE",
    QUEUED_REQUEST_ERROR: "QUEUED_REQUEST_ERROR"
}

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
  });
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    const message = event.data;
    switch(message.type) {
        case SW_MESSAGES.ONLINE: {
            processQueue();
            break;
        }
        default:
            throw new Error(`Unhandled message ${message.value}`)
    }
});

async function postMessage(msg, transfer = undefined) {
    (await self.clients.matchAll()).forEach((c) => c.postMessage(msg, transfer));
}

let queue = [];

/**
 * 
 * @param {Request} request 
 */
function addToQueue(request) {
    queue.push(request);
    postMessage({ type: SW_MESSAGES.QUEUE_UPDATE, data: queue.map((r) => r.url) });
}

/**
 * 
 * @param {Request} request 
 */
async function processQueuedRequest(request) {
    const response = await networkFirstThenQueue(request);
    if(!response.ok) {
        console.warn('Queued request returned an error', response);
        postMessage({ type: SW_MESSAGES.QUEUED_REQUEST_ERROR, data: { url: request.url, method: request.method, status: response.status, statusText: response.statusText } });
    }
    postMessage({ type: SW_MESSAGES.QUEUE_UPDATE, data: queue.map((r) => r.url) });
}

function processQueue() {
    console.log("processing queued requests...");
    const oldqueue = queue;
    queue = [];
    oldqueue.forEach(processQueuedRequest);
}

async function networkFirstThenQueue(request) {
    const clone = request.clone();
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (e) {
        console.warn('Unable to process, it will be added to queue', e);
        addToQueue(clone);
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

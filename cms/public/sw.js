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
    const unmodified = request.headers.get('If-Unmodified-Since');
    const noneMatch = request.headers.get('If-None-Match');
    let ok = true;
    if(request.method === "PUT" && (unmodified || noneMatch)) {
        // nginx webdav does not seem to correctly use if- request headers, so we need to do the job ourselves
        const headers = {
            "Authorization": request.headers.get('Authorization')
        };
        if(unmodified) {
            headers["If-Unmodified-Since"] = unmodified;
        }
        if(noneMatch) {
            headers["If-None-Match"] = noneMatch;
        }
        const head = await fetch(request.url, {
            method: "HEAD",
            headers
        });
        if(!head.ok && head.status !== 404) {
            console.warn('Queued request returned an error during head', head);
            postMessage({ type: SW_MESSAGES.QUEUED_REQUEST_ERROR, data: { url: request.url, method: "HEAD", status: head.status, statusText: head.statusText } });
            ok = false;
        } else {
            // check If-Unmodified-Since
            const unmodifiedDate = new Date(unmodified);
            const lastModifiedDate = new Date(head.headers.get("Last-Modified"));
            if(
                !Number.isNaN(unmodifiedDate.getTime()) && !Number.isNaN(lastModifiedDate.getTime())
                && lastModifiedDate.getTime() >= unmodifiedDate.getTime()
            ) {
                console.warn('Queued request is outdated', head);
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since
                postMessage({ type: SW_MESSAGES.QUEUED_REQUEST_ERROR, data: { url: request.url, method: request.method, status: 412, statusText: "Precondition failed (If-Unmodified-Since)" } });
                ok = false;
            }

            // check If-None-Match <etag>
            const etag = request.headers.get('Etag');
            console.log(noneMatch);
            console.log(etag);
            if(noneMatch === "*" || (!!noneMatch && noneMatch === etag)) {
                console.warn('Queued request is alreay on the server', head);
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match
                postMessage({ type: SW_MESSAGES.QUEUED_REQUEST_ERROR, data: { url: request.url, method: request.method, status: 412, statusText: "Precondition failed (If-None-Match)" } });
                ok = false; 
            }
        }
    }

    if(ok) {
        const response = await networkFirstThenQueue(request);
        if(!response.ok) {
            console.warn('Queued request returned an error', response);
            postMessage({ type: SW_MESSAGES.QUEUED_REQUEST_ERROR, data: { url: request.url, method: request.method, status: response.status, statusText: response.statusText } });
        }
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

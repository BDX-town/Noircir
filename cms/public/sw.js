const context = {
    webdavServer: undefined,
    webdavAuth: undefined,
}

self.addEventListener('message', (event) => {
    const message = event.data;
    switch(message.type) {
        case "webdav": {
            context.webdavServer = message.value;
            break;
        }
        default:
            throw new Error(`Unhandled message ${message.value}`)
    }
});

self.addEventListener("fetch", (event) => {
    if(!event.request.url.startsWith(context.webdavServer)) return;
    if(event.request.headers.get("authorization")) {
        context.webdavAuth = event.request.headers.get("authorization");
    } else if(context.webdavAuth) {
          // decide for yourself which values you provide to mode and credentials
        // Copy existing headers
        const headers = new Headers(event.request.headers);
        // Set a new header
        headers.set('authorization', context.webdavAuth);
        const newRequest = new Request(event.request, {
            headers: headers
        })
        event.respondWith(fetch(newRequest));
    }
});
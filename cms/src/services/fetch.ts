const MAX_RETRIES = 3;

/**
 * Allow to abort a network call
 * @param url 
 * @param init 
 * @returns 
 */
export function fetchWithAbort(url: string, init?: RequestInit) {
    const controller = new AbortController();
    const call = fetch(url, {
        ...init,
        signal: controller.signal,
    });
    return [call, () => controller.abort()];
}

/**
 * Allow fetch-like request to fail up to MAX_RETRIES times 
 * in case of network or server error (500)
 */
export async function fetchWithRetry(fn: () => Promise<Response>, retries = 0) {
    let response;
    try {
        response = await fn();
    } catch (e) {
        // if fetch, network error we will retry
        if(retries < MAX_RETRIES) return fetchWithRetry(fn, retries + 1);
        else throw e;
    }
    // everything is ok we return the response
    if(response.ok) return response;
    // there was an error on the server, we may retry
    if(response.status >= 500 && response.status <= 599) {
        if(retries < MAX_RETRIES) return fetchWithRetry(fn, retries + 1);
    }
    return response;
}

/**
 * Ensure that a webdav call expose the same behavior as a fetch
 * @param fn function to turn into a fetch-like request
 * @param rest params to pass to that function
 * @returns A response object
 */
export async function fetchAdapter(fn: (p?: any) => Promise<unknown>, ...rest : any) {
    try {
        const body = await fn(...rest);
        return new Response(body as any);
    } catch (e) {
        const error = e as Error;
        const codeMatch = error.message.match(/[0-9]{3}/);
        return new Response(null, { 
            status: codeMatch ? parseInt(codeMatch[1], 10) : 500,
            statusText: error.message
        })
    }
}
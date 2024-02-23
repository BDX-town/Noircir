export function buildUrl(url: string, host?: string) {
    const sanUrl = url.replace(/([^:]\/)\/+/g, "$1");
    return new URL(sanUrl, host || import.meta.env.VITE_SERVER ).href
}
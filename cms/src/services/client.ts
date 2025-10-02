import { createClient, type FileStat, type WebDAVClient } from "webdav";

let client: WebDAVClient | undefined = undefined

export function connect(username: string, password: string) {
    // TODO: yes this is bad
    localStorage.setItem('NOIRCIR_USERNAME', username)
    localStorage.setItem('NOIRCIR_PASSWORD', password)
    client = createClient(
        `${import.meta.env.VITE_SERVER}/${import.meta.env.VITE_BLOGS_FOLDER}/${username}`,
        {
            username,
            password
        }
    );
    return client;
}

export function init() {
    // TODO: yes this is bad 
    const username = localStorage.getItem('NOIRCIR_USERNAME')
    const password = localStorage.getItem('NOIRCIR_PASSWORD')

    if (!username || !password) return undefined;
    return connect(username, password)
}

export function getBlogContent(): Promise<FileStat[]> {
    if(!client) throw new Error("Client is not initialized")
    // TODO: can be cached here to avoid retrieveing unmodified content 
    return client.getDirectoryContents("/") as Promise<FileStat[]>
}

export {
    client
}
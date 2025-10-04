import { createClient, type FileStat, type WebDAVClient } from "webdav";
import { AppError, declareError, type ErrorDefinition } from "../utils/error";

let client: WebDAVClient | undefined = undefined

export const NOT_AUTHENTICATED_ERROR = declareError({ fatal: false, translationKey: "Vous devez être connecté pour réaliser cette opération"})
export const BAD_CREDENTIALS_ERROR: ErrorDefinition = declareError({ translationKey: "Impossible de se connecter avec ces identifiants", fatal: false })
export async function connect(username: string, password: string) {
    // TODO: yes this is bad
    localStorage.setItem('NOIRCIR_USERNAME', username)
    localStorage.setItem('NOIRCIR_PASSWORD', password)
    const c = createClient(
        `${import.meta.env.VITE_SERVER}/${import.meta.env.VITE_BLOGS_FOLDER}/${username}`,
        {
            username,
            password
        }
    );
    try {
        await getBlogContent(c)
    } catch (e) {
        console.error(e)
        throw new AppError(BAD_CREDENTIALS_ERROR)
    }
    client = c;
    return client;
}

export function init() {
    // TODO: yes this is bad 
    const username = localStorage.getItem('NOIRCIR_USERNAME')
    const password = localStorage.getItem('NOIRCIR_PASSWORD')

    if (!username || !password) return undefined;
    return connect(username, password)
}

export function getBlogContent(c: WebDAVClient | undefined = undefined): Promise<FileStat[]> {
    const currentClient = c || client
    if(!currentClient) throw new Error("Client is not initialized")
    // TODO: can be cached here to avoid retrieveing unmodified content 
    return currentClient.getDirectoryContents("/") as Promise<FileStat[]>
}

export {
    client
}
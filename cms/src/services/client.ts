import { createClient, type FileStat, type WebDAVClient } from "webdav";
import { AppError, declareError, type ErrorDefinition } from "../utils/error";


type NoircirClient = WebDAVClient & { username: string, password: string }

let client: NoircirClient | undefined = undefined

export const NOT_AUTHENTICATED_ERROR = declareError({ fatal: false, translationKey: "Vous devez être connecté pour réaliser cette opération"})
export const BAD_CREDENTIALS_ERROR: ErrorDefinition = declareError({ translationKey: "Impossible de se connecter avec ces identifiants", fatal: false })
export const UNABLE_CHANGE_PASSWORD_ERROR = declareError({ fatal: false, translationKey: "Impossible de sauvegarder le nouveau mot de passe"})
export async function connect(username: string, password: string) {
    // TODO: yes this is bad
    localStorage.setItem('NOIRCIR_USERNAME', username)
    localStorage.setItem('NOIRCIR_PASSWORD', password)
    let c = createClient(
        `${import.meta.env.VITE_SERVER}/${import.meta.env.VITE_BLOGS_FOLDER}/${username}`,
        {
            username,
            password
        }
    ) as NoircirClient;
    Object.assign(c, { username, password })
    try {
        await getBlogContent(c)
    } catch (e) {
        console.error(e)
        throw new AppError(BAD_CREDENTIALS_ERROR, e as Error)
    }
    client = c;
    return client;
}

export function disconnect() {
    localStorage.setItem('NOIRCIR_USERNAME', '')
    localStorage.setItem('NOIRCIR_PASSWORD', '')
    client = undefined
}

export function init() {
    // TODO: yes this is bad 
    const username = localStorage.getItem('NOIRCIR_USERNAME')
    const password = localStorage.getItem('NOIRCIR_PASSWORD')

    if (!username || !password) return undefined;
    return connect(username, password)
}

export async function changePassword(newpass: string) {
    if(!client) throw new AppError(NOT_AUTHENTICATED_ERROR)
    try {
        const request = await fetch(`${import.meta.env.VITE_SERVER}/${import.meta.env.VITE_BLOGS_FOLDER}/${client.username}/password`,{
            headers: { 
                'Authorization': `Basic ${btoa(`${client.username}:${client.password}`)}`
            },
            method: "POST",
            body: newpass
        })
        if(!request.ok) throw new Error(`${request.status}: ${request.statusText}`)
        const passwd = await request.text()
        const result = await client.putFileContents(`/.auth.allow`, `${client.username}:${passwd}`)
        if(!result) throw new Error('Unable to put new file content .auth.allow')
    } catch (e) {
        console.error(e)
        throw new AppError(UNABLE_CHANGE_PASSWORD_ERROR, e as Error)
    }
}

export function getBlogContent(c: NoircirClient | undefined = undefined): Promise<FileStat[]> {
    const currentClient = c || client
    if(!currentClient) throw new Error("Client is not initialized")
    // TODO: can be cached here to avoid retrieveing unmodified content 
    return currentClient.getDirectoryContents("/") as Promise<FileStat[]>
}

export {
    client
}
import { AppError } from "../utils/error";
import { client, getBlogContent, NOT_AUTHENTICATED_ERROR } from "./client";
import { arrayBufferToWebP } from 'webp-converter-browser'
import { blake3 } from '@noble/hashes/blake3.js';

function getRessourceURL(name: string) {
    return `${import.meta.env.VITE_SERVER}/${import.meta.env.VITE_BLOGS_FOLDER}/${client?.username}/${import.meta.env.VITE_RESSOURCES_FOLDER}/${name}`
}

export async function fetchRessources(): Promise<string[]> {
    const filedefs = (await getBlogContent(undefined, `/${import.meta.env.VITE_RESSOURCES_FOLDER}`))
        .filter((f) => f.type === "file" && f.filename.endsWith('.webp'))
    // TODO: can be cached here to avoid retrieveing unmodified articles 
    const results = filedefs.map((f) => getRessourceURL(f.basename))
    return results;
}

export async function saveRessource(dataurl: string) {
    if (!client) throw new AppError(NOT_AUTHENTICATED_ERROR)

    const response = await fetch(dataurl)
    const webpBlob = await arrayBufferToWebP(await response.arrayBuffer(), { quality: parseFloat(import.meta.env.VITE_WEBP_QUALITY) })
    const buffer = await webpBlob.arrayBuffer()
    const hash = await blake3(new Uint8Array(buffer))
    const name = Array.from(hash)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .replace(/[\\/:*?"<>|]/g, '_');
    const result = await client.putFileContents(`/${import.meta.env.VITE_RESSOURCES_FOLDER}/${name}.webp`, buffer, { overwrite: true })
    if (!result) throw new Error('Unable to save ressource')
    return getRessourceURL(`${name}.webp`)
}
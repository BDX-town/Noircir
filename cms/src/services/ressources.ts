import { AppError } from "../utils/error";
import { client, NOT_AUTHENTICATED_ERROR } from "./client";
import { arrayBufferToWebP } from 'webp-converter-browser'
import { blake3 } from '@noble/hashes/blake3.js';

function getRessourceURL(name: string) {
    return `${import.meta.env.SERVER}/${import.meta.env.BLOGS_FOLDER}/${client?.username}/${import.meta.env.RESSOURCES_FOLDER}/${name}`
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
    const result = await client.putFileContents(`/${import.meta.env.RESSOURCES_FOLDER}/${name}.webp`, buffer, { overwrite: true })
    if (!result) throw new Error('Unable to save ressource')
    return getRessourceURL(`${name}.webp`)
}
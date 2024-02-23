import { Media } from '../types/Media';
import { WebdavClient, WebdavFile } from '../types/webdav';
import { buildUrl } from '../helpers/buildUrl';

export function deserializeMedia(m: Media): Media {
    return {
        ...m,
        updatedAt: new Date(m.updatedAt)
    }
}

async function parseMedia(client: WebdavClient, file: WebdavFile): Promise<Media> {
    return {
        file: file.basename,
        updatedAt: new Date(file.lastmod),
        weight: file.size,
        url: buildUrl(file.filename),
        content: await client.getFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${file.basename}`),
    }
}

export async function putMedia(client: WebdavClient, media: Media) {
    const request = await client.putFileContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${media.file}`, media.content, { overwrite: true, contentLength: media.weight });
    if(request) {
        return {
            ...media,
            url: buildUrl(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${media.file}`),
        }
    }
    throw new Error('Unable to upload');
}

export function deleteMedia(client: WebdavClient, media: Media) {
    return client.deleteFile(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources/${media.file}`);
} 

export async function fetchMedia(client: WebdavClient): Promise<Media[]> {
    const files: WebdavFile[] = await client.getDirectoryContents(`/${import.meta.env.VITE_BLOGS_PATH}/${client.username}/ressources`);
    // dont know why folder is sometimes shown as file
    return Promise.all(files.map((f) => parseMedia(client, f)));
}